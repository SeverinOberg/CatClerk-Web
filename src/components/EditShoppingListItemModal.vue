<template>
  <div>
    <ion-header>
      <ion-toolbar >
          <ion-title>{{ title }}</ion-title>
          <ion-icon
            name="close-circle-outline"
            size="large"
            class="ion-float-right ion-padding"
            @click="closeModal()"
          ></ion-icon>
      </ion-toolbar>
    </ion-header>

    <ion-content id="content" >
      
      <form @submit.prevent="onSubmit">
            
            <ion-label class="input-labels">Food</ion-label>
            <ion-item class="inputs" lines="none">
              <ion-input
                :value="nameInput"
                @ionInput="nameInput = $event.target.value;"
                name="name"
                clearInput
              />
            </ion-item> 
            <ion-item class="search-items" lines="none" @click="searchItemClick(food.name)" v-for="(food, index) in filteredFoods" :key="index">
              <div><ion-title>{{ food.name }}</ion-title></div>
            </ion-item>

          <ion-label class="input-labels">Type</ion-label>
          <ion-item class="inputs" lines="none">
            <ion-select interface="popover" placeholder="Select" :value="quantityTypeInput" @ionChange="setQuantityType($event.detail.value)" >
              <ion-select-option value="pieces">Pieces</ion-select-option>
              <ion-select-option value="grams">Grams (g)</ion-select-option>
              <ion-select-option value="kilos">Kilos (kg)</ion-select-option>
              <ion-select-option value="liters">Liters (l)</ion-select-option>
              <ion-select-option value="milliliters">Milliliters (ml)</ion-select-option>
            </ion-select>
          </ion-item>

            <ion-label class="input-labels">Amount</ion-label>
            <ion-item class="inputs" lines="none">
              <ion-input
                type="number"
                :value="quantityInput"
                @ionInput="quantityInput = $event.target.value;"
                name="quantityInput"
                clearInput
              />
            </ion-item> 

            <ion-item class="update-btn-wrapper" lines="none">
              <ion-button class="update-btn" type="submit">Update</ion-button>
            </ion-item>

      </form>

    </ion-content>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  modalController,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
} from "@ionic/vue";

import { addIcons } from "ionicons";
import { closeCircleOutline } from "ionicons/icons";

import utilities from "@/ion/utilities";

import misc from "@/services/misc";
import shoppingListItems from "@/services/shoppingListItems";

addIcons({
  "close-circle-outline": closeCircleOutline,
});

export default defineComponent({
  name: "EditShoppingListItemModal",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
  },
  props: {
    title: { type: String, default: "Edit Shopping List Item" },
    username: { type: String },
    itemID: { type: Number },
    shoppingListID: { type: Number },
  },
  data() {
    return {
      selectedName: "",
      nameInput: "",
      quantityInput: NaN,
      quantityTypeInput: "",
      foods: [
        { name: "" },
      ],
    };
  },
setup() {
    const util = new utilities();

    return {
      util,
    };
},
created() {
  this.getFoods();
  this.getItem()
},
computed: {
    filteredFoods()  {
      if (this.nameInput.length < 1) {
        return [];
      }
      if (this.nameInput.length == this.selectedName.length) {
        return [];
      }
      return this.foods.filter(food => {
        return food.name.toLowerCase().indexOf(this.nameInput.toLowerCase()) >= 0 ;
      });
    }
},
  methods: {
    async getFoods() {
      await misc.getFoods(this.username)
      .then(r => this.foods = r.data)
      .catch(e => console.log(e))
    },
    searchItemClick(newName) {
      this.nameInput = newName;
      this.selectedName = newName;

      this.onSubmit()
    },
    async closeEditModal() {
      return await modalController.dismiss({
        role: "cancel",
      });
    },
    async closeModal() {
      this.closeEditModal();
      (document.getElementById("ionList")).closeSlidingItems();
    },
    getItem() {
      shoppingListItems.get(this.username, this.shoppingListID, this.itemID)
      .then(r => (
        this.nameInput = r.data.title,
        this.selectedName = r.data.title,
        this.quantityInput = r.data.quantity,
        this.quantityTypeInput = r.data.quantityType
      ))
      .catch(e => console.log(e))
    },
    setQuantityType(value) {
      this.quantityTypeInput = value;
    },
    onSubmit() {
      // Update database on this folde
      let exists = false;
      for (let i = 0; i < this.foods.length; i++) {
        const element = this.foods[i];
        if (element.name == this.nameInput) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        this.util.ionAlert("Woops!", "You must use one of the drop-down food items.", ["OK"]);
        return
      }

      const payload = {title: this.nameInput, quantity: Number(this.quantityInput), quantityType: this.quantityTypeInput}

      let success = false;
      shoppingListItems.update(this.username, this.shoppingListID, this.itemID, payload)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.$emit("refresh-shopping-list-items", this.username, this.shoppingListID)
          this.util.ionToast("Successfully updated item.");
        } else {
          this.util.ionToast("Something went wrong trying to update item.");
          return
        }
      })
    
      this.closeEditModal();
      (document.getElementById("ionList")).closeSlidingItems();
      this.nameInput = "";
    },
  },
});
</script>

<style scoped lang="scss" >
ion-toolbar {
  --background: var(--background-pri-hover);
}

ion-content {
  height: 100vh;
  --background: var(--background-pri);
}

.search-items {
  --background: var(--background-sec);
  border-bottom: 1px solid rgb(39, 53, 59);
  --min-height: 50px;
  z-index: 2;
}

ion-icon {
  background: none;
  transition: all 200ms ease-in-out;
  &:hover {
    background:var(--background-pri);
    border-radius: 5px;
  }
}

.update-btn-wrapper {
  margin-top: 10px;
  margin-bottom: 100px;

}

.update-btn {
  width: 80%;
  height: 70px;
  margin: 0 auto;
  --background: var(--background-tri);
}
</style>
