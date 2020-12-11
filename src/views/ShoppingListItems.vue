<template>
  <ion-page>
    <Header title="Shopping List Items" />
    <ion-content :fullscreen="true">

      <ion-icon class="back-arrow" :icon="arrowBack" @click="goBack()"></ion-icon>

      <ion-item-group>

      <div v-if="data.length != 0">
        <ion-icon id="tooltip-icon" @click="showTooltip = !showTooltip" size="large" :icon="helpCircle"></ion-icon>
        <ion-card id="tooltip-card" v-if="showTooltip">
          <ion-icon class="top-right" :icon="close" @click="showTooltip = false" size="large"></ion-icon>
          You can slide your items both left and right to edit or delete your items.
          <br />
          <br />
          The number on the left tells you the quantity of food.
          </ion-card>
      </div>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event, getShoppingListItems)">
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing...">
      </ion-refresher-content>
    </ion-refresher>

    <ion-list id="ionList" style="clear:both;" lines="none">

      <div v-if="data.length != 0">

          <ion-item class="search-input" lines="none">
            <ion-label position="floating">Search</ion-label>
            <ion-input
              :value="searchInput"
              @input="searchInput = $event.target.value"
              name="searchInput"
            >
            
            </ion-input>
          </ion-item>

        <ion-reorder-group
          id="reorderGroup"
          @ionItemReorder="doReorder($event)"
          disabled="false"
        >
          <!-- Create items -->
          <div v-for="item in searchItems" :key="item.id">
            <ion-item-sliding>
              <!-- Right side options -->
              <ion-item-options>
                  <ion-item-option
                    class="edit-option"
                    @click="setEditShoppingListItemModalOpen(true), setItemID(item.id)"
                  >
                  <ion-modal
                    animated
                    :is-open="isEditShoppingListItemModalOpen"
                    css-class="my-custom-class"
                    @onWillDismiss="setEditShoppingListItemModalOpen(false)"
                    >
                    <EditShoppingListItemModal @refresh-shopping-list-items="getShoppingListItems" :username="username" :shoppingListID="shoppingListID" :itemID="itemID" />
                  </ion-modal>
                    <ion-icon :icon="pencil" size="large"></ion-icon>
                  </ion-item-option>
                  <ion-item-option
                    class="delete-option"
                    @click="deleteItemAlert(item.id)"
                  >
                    <ion-icon :icon="trash" size="large"></ion-icon>
                  </ion-item-option>
                </ion-item-options>

                <!-- Left side options -->
                <ion-item-options side="start">
                  <ion-item-option
                    class="decrement-option"
                    @click="decrementQuantity(item.id)"
                  >
                    <ion-icon :icon="remove" size="large"></ion-icon>
                  </ion-item-option>

                  <ion-item-option
                    class="increment-option"
                    @click="incrementQuantity(item.id)"
                  >
                    <ion-icon :icon="add" size="large"></ion-icon>
                  </ion-item-option>

                </ion-item-options>

                <!-- Item -->
                <ion-item class="data-items" lines="none">
                  
                  <ion-badge>
                    {{item.quantity}}
                    <ion-text v-if="item.quantityType == 'pieces'"></ion-text>
                    <ion-text v-if="item.quantityType == 'grams'">g</ion-text>
                    <ion-text v-if="item.quantityType == 'kilos'">kg</ion-text> 
                    <ion-text v-if="item.quantityType == 'liters'">l</ion-text> 
                    <ion-text v-if="item.quantityType == 'milliliters'">ml</ion-text> 
                  </ion-badge>

                  <ion-label id="item-title">{{item.title}}</ion-label>

                  <ion-reorder>
                    <ion-icon :icon="reorderTwo" size="large"></ion-icon>
                  </ion-reorder>
                </ion-item>
              </ion-item-sliding>
               
          </div>
          </ion-reorder-group>
          </div>
          <div v-else>
            <ion-title>Create a new item to begin.</ion-title>
          </div>
       </ion-list>


    </ion-item-group>

      <ion-fab>
        <ion-fab-button @click="newItem()">
          +
          <ion-icon :icon="fastFood"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    
  </ion-page>
</template>

<script>
import { 
  arrowBack,
  trash,
  pencil,
  reorderTwo,
  helpCircle,
  close,
  fastFood,
  remove,
  add,
  chevronDownCircleOutline,
} from 'ionicons/icons';
import { 
  alertController,
  IonPage,
  IonContent,
  IonCard,
  IonIcon,
  IonFabButton,
  IonFab,
  IonItemGroup,
  IonItemOptions,
  IonItemOption,
  IonReorderGroup,
  IonReorder,
  IonLabel,
  IonList,
  IonItem,
  IonItemSliding,
  IonInput,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonBadge,
  IonText,
} from '@ionic/vue';
import Header from '@/components/Header.vue';
import misc from '@/services/misc'
import EditShoppingListItemModal from "@/components/EditShoppingListItemModal.vue";
import shoppingListItems from '@/services/shoppingListItems'
import utilities from "@/ion/utilities";
import { defineComponent, ref } from 'vue';

export default defineComponent ({
  name: 'ShoppingListItems',
  components: { 
    Header, 
    EditShoppingListItemModal,
    IonPage, 
    IonContent,
    IonIcon,
    IonCard,
    IonFabButton,
    IonFab,
    IonItemGroup,
    IonItemOptions,
    IonItemOption,
    IonReorderGroup,
    IonReorder,
    IonLabel,
    IonList,
    IonItem,
    IonItemSliding,
    IonInput,
    IonModal,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonBadge,
    IonText,
  },
  data() {
    return {      
      selectedName: "",
      nameInput: "",
      username: "",
      searchInput: "",
      showTooltip: false,
      shoppingListID: "",
      itemID: NaN,
      data: [],
      foods: []
    }
  },
  setup() {
    const util = new utilities();

    // Functions
    const doRefresh = (event, refresh) => {
      setTimeout(() => {
        refresh();
        event.target.complete();
      }, 1000);
    }

    const doReorder = (event) => {
      event.detail.complete();
    };

    // Ion Modal
    const isEditShoppingListItemModalOpen = ref(false);
    const setEditShoppingListItemModalOpen = (state) => (isEditShoppingListItemModalOpen.value = state);


    return {
      util,

      // Functions
      doRefresh,
      doReorder,

      // Ion Modal
      isEditShoppingListItemModalOpen,
      setEditShoppingListItemModalOpen,

      // Ion Icons

      arrowBack,
      trash,
      pencil,
      reorderTwo, 
      helpCircle, 
      close,
      fastFood,
      remove,
      add,
      chevronDownCircleOutline,
    }
  },
  computed: {
    searchItems:function()  {
      return this.data.filter(item => {
        return item.title.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0 ;
      });
    },
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
  created() {
    this.username = this.$route.params.username.toString()
    this.shoppingListID = Number(this.$route.params.shoppingListId)

    this.getShoppingListItems()
    this.getFoods()
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
    },
    getShoppingListItems() {
     return shoppingListItems.getAll(this.username, this.shoppingListID)
      .then(r => this.data = r.data)
      .catch(e => console.log(e))
    },
    setItemID(itemID) {
      this.itemID = itemID;
    },
    newItem() {
      let success = false;
      const payload = {title: "New Item", quantity: 1, quantityType: "pieces"}
      shoppingListItems.create(this.username, this.shoppingListID, JSON.stringify(payload))
      .then(r => success = r.status == 204)
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully created item.");
          this.getShoppingListItems(this.username, this.shoppingListID)
        } else {
          this.util.ionToast("Something went wrong trying to create the item.");
        }
      })
    },
    async editShoppingListItemAlert(itemID, currentValue) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "New title?",
        message: "Insert new title below",
        inputs: [
            {
              placeholder: currentValue,
            },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              (document.getElementById("ionList")).closeSlidingItems();
            },
          },
          {
            text: "Done",
            handler: data => {
              this.editItem(itemID, data[0]);
              
              (document.getElementById("ionList")).closeSlidingItems();
            },
          },
        ],
      });
      return alert.present();
    },
    editItem(itemID, newTitle) {
      let success = false;
      shoppingListItems.patchTitle(this.username, this.shoppingListID, itemID, newTitle)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully edited item.");
          this.getShoppingListItems()
        } else {
          this.util.ionToast("Something went wrong trying to edit the item.");
        }
     })
    },
    decrementQuantity(itemID) {
      let success = false;
      shoppingListItems.decrementQuantity(this.username, this.shoppingListID, itemID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getShoppingListItems()
        } else {
          this.util.ionToast("Something went wrong trying to decrement quantity.");
        }
      })
    },
    incrementQuantity(itemID) {
      let success = false;
      shoppingListItems.incrementQuantity(this.username, this.shoppingListID, itemID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getShoppingListItems()
        } else {
          this.util.ionToast("Something went wrong trying to increment quantity.");
        }
      })
    },
    async deleteItemAlert(itemID) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Are you sure?",
        message: "Deleting an item cannot be undone.",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              (document.getElementById("ionList")).closeSlidingItems();
            },
          },
          {
            text: "Delete",
            handler: () => {
              this.deleteItem(itemID);
              (document.getElementById("ionList")).closeSlidingItems();
            },
          },
        ],
      });
      return alert.present();
    },
    deleteItem(itemID) {
      let success = false;
      shoppingListItems.delete(this.username, this.shoppingListID, itemID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully deleted item.");
          this.getShoppingListItems()
        } else {
          this.util.ionToast("Something went wrong trying to delete the item.");
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
})
</script>

<style scoped lang="scss">
.back-arrow {
  float: left;
  padding: 3px;
  font-size: 2.5rem;
  color: rgb(202, 213, 221);
}

#ionList {
  background: none;
  min-height: 71vh;
}

ion-item-option{
  margin-top: 1px;
  height: 68px;
  width: 68px;
}

#item-title {
  text-align: center;
}

.decrement-option {
  background:  rgb(36, 84, 112);
}

.increment-option {
  background:  rgb(45, 133, 184);
}

#tooltip-icon {
  float:right;
  padding: 7px;
  color: rgb(114, 166, 199);
}

#tooltip-card {
  display: flex;
  top: 50%; 
  left: 50%;
  transform: translate(-50%, -50%);
  position: fixed;
  font-size: 1.2rem;
  width: 300px;
  z-index: 1;
  padding: 50px;
}


</style>