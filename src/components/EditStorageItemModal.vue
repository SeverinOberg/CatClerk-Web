<template>
  <div>
    <ion-header>
      <ion-toolbar >
          <ion-title>{{ title }}</ion-title>
          <ion-icon
            :icon="closeCircleOutline"
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
               <ion-icon
                  :icon="search"
                  size="small"
                  style="margin-right: 5px;"
                ></ion-icon>
              <ion-input v-if="nameInput == 'New Item'"
                @ionInput="nameInput = $event.target.value;"
                name="name"
              >

              </ion-input>
              <ion-input v-else
                :value="nameInput"
                @ionInput="nameInput = $event.target.value;"
                name="name"
                clearInput
                >
              </ion-input>
            </ion-item>  
            <ion-item class="search-items" lines="none" @click="searchItemClick(food.name)" v-for="food in filteredFoods" :key="food.id">
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
                name="quantity"
                clearInput
              />
            </ion-item> 

            <ion-label class="input-labels">Want Atleast Amount</ion-label>
            <ion-item class="inputs" lines="none">
              <ion-input
                type="number"
                :value="quantityThresholdInput"
                @ionInput="quantityThresholdInput = $event.target.value;"
                name="quantityThreshold"
                clearInput
              />
            </ion-item> 

            <ion-label class="input-labels">Expiration Date</ion-label>
              <ion-item class="inputs" lines="none">
                <ion-datetime
                style="color: #ddd;"
                @ionChange="setExpirationDate($event.detail.value)"
                :value="expirationDateInput"
                placeholder="DD/MM/YYYY"
                display-format="DD/MM/YYYY"
                min="2020-01-01"
                max="2030-12-31"
                 >
                 </ion-datetime>
              </ion-item>

            <ion-label class="input-labels">Days Before Notify</ion-label>
            <ion-item class="inputs" lines="none">
              <ion-input
                type="number"
                :value="expirationThresholdInput"
                @ionInput="expirationThresholdInput = $event.target.value;"
                name="quantityThreshold"
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
  IonButton,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";

import { closeCircleOutline, search } from "ionicons/icons";

import utilities from "@/ion/utilities";

import misc from "@/services/misc";
import storageItems from "@/services/storageItems";


export default defineComponent({
  name: "EditStorageItemModal",
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonButton,
    IonDatetime,
    IonSelect,
    IonSelectOption,
  },
  props: {
    title: { type: String, default: "Edit Storage Item" },
    username: { type: String },
    itemID: { type: Number },
    storageID: { type: Number },
  },
  data() {
    return {
      selectedName: "",
      nameInput: "",
      quantityInput: 1,
      quantityTypeInput: "pieces",
      quantityThresholdInput: 0,
      expirationThresholdInput: 0,
      expirationDateInput: "",
      foods: [],
    };
  },
setup() {
    const util = new utilities();

    return {
      util,
      closeCircleOutline,
      search,
    };
},
created() {
  this.getFoods()
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
      await misc.getFoods(this.$route.params.username.toString())
      .then(r => this.foods = r.data)
      .catch(e => console.log(e))
    },
    getItem() {
      storageItems.get(this.username, this.storageID, this.itemID)
      .then(r => (
        this.nameInput = r.data.title,
        this.selectedName = r.data.title,
        this.quantityInput = r.data.quantity,
        this.quantityTypeInput = r.data.quantityType,
        this.quantityThresholdInput = r.data.quantityThreshold,
        this.expirationThresholdInput = r.data.expirationThreshold,
        this.expirationDateInput = r.data.expirationDate
      ))
      .catch(e => console.log(e))
    },
    searchItemClick(newName) {
      this.nameInput = newName;
      this.selectedName = newName;
    },
    setExpirationDate(date) {
      const d = String(date).substring(0, 10)
      this.expirationDateInput = d
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
     
      const payload = {
        title: this.nameInput,
        quantity: Number(this.quantityInput),
        quantityType: this.quantityTypeInput,
        quantityThreshold: Number(this.quantityThresholdInput),
        expirationThreshold: Number(this.expirationThresholdInput),
        expirationDate: this.expirationDateInput,
      }

      let success = false;

      storageItems.update(this.$route.params.username.toString(), this.storageID, this.itemID, payload)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.$emit("refresh-storage-items", this.username, this.storageID)
          this.util.ionToast("Successfully updated item.");
        } else {
          this.util.ionToast("Something went wrong trying to update item.");
          return
        }
      })
    
      this.closeEditModal();
      (document.getElementById("ionList")).closeSlidingItems();

      // this.nameInput = "";
      // this.quantityInput = 1;
      // this.quantityTypeInput = 'pieces';
      // this.quantityThresholdInput = 0;
      // this.expirationThresholdInput = 0;
      // this.expirationDateInput = "";
    },
    setQuantityType(value) {
      this.quantityTypeInput = value;
    }
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
    background: var(--background-pri);
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
