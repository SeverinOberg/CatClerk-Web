<template>
  <ion-page>
    <Header title="Storage Items" />
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

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event, getStorageItems)">
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
            />
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
                    @click="setEditStorageModalOpen(true), setItemID(item.id)"
                  >
                    <ion-modal
                    animated
                    :is-open="isEditStorageModalOpen"
                    css-class="my-custom-class"
                    @onWillDismiss="setEditStorageModalOpen(false)"
                    >
                    <EditStorageItemModal @refresh-storage-items="getStorageItems" :username="username" :storageID="storageID" :itemID="itemID" />
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
                <ion-item @click="setClickedItem(item.id)" class="data-items" lines="none">
                  <ion-badge>{{item.quantity}}
                    <ion-text v-if="item.quantityType == 'pieces'"></ion-text>
                    <ion-text v-if="item.quantityType == 'grams'">g</ion-text>
                    <ion-text v-if="item.quantityType == 'kilos'">kg</ion-text> 
                    <ion-text v-if="item.quantityType == 'liters'">l</ion-text> 
                    <ion-text v-if="item.quantityType == 'milliliters'">ml</ion-text> 
                  </ion-badge> 
                  <ion-icon 
                    :icon="alertCircleOutline" 
                    color="danger" 
                    v-if="isLowQuantity(item.quantity, item.quantityThreshold) ||
                    isExceededExp(item.expirationDate, item.expirationThreshold)">
                  </ion-icon>
                  
                  <ion-label id="item-title">{{item.title}}</ion-label>
                  <ion-reorder>
                    <ion-icon :icon="reorderTwo" size="large"></ion-icon>
                  </ion-reorder>
                  
                </ion-item>
                <!-- Drop down item -->
                <ion-item id="drop-down-wrapper" v-if="clickedItem == item.id" lines="none">

                  <ion-card class="drop-down-content" lines="none">
                    <ion-card-subtitle>
                      Amount Notify
                    </ion-card-subtitle>
                    <ion-card-content>
                      {{ item.quantityThreshold }}
                    <ion-text v-if="item.quantityType == 'pieces'"></ion-text>
                    <ion-text v-if="item.quantityType == 'grams'">g</ion-text>
                    <ion-text v-if="item.quantityType == 'kilos'">kg</ion-text> 
                    <ion-text v-if="item.quantityType == 'liters'">l</ion-text> 
                    <ion-text v-if="item.quantityType == 'milliliters'">ml</ion-text> 
 

                  </ion-card-content>
                   <ion-icon 
                      style="font-size:25px; float: right; padding: 5px;"
                      :icon="alertCircleOutline" 
                      color="danger" 
                      v-if="isLowQuantity(item.quantity, item.quantityThreshold)">
                    </ion-icon>
                  </ion-card>

                  <ion-card class="drop-down-content" lines="none">
                    <ion-card-subtitle>
                      Exp Notify
                    </ion-card-subtitle>
                    <ion-card-content>
                      {{ item.expirationThreshold }} Days
                    </ion-card-content>
                    <ion-icon 
                      style="font-size:25px; float: right; padding: 5px;"
                      :icon="alertCircleOutline" 
                      color="danger" 
                      v-if="isExceededExp(item.expirationDate, item.expirationThreshold)">
                    </ion-icon>
                  </ion-card>

                  <ion-card class="drop-down-content" lines="none">
                    <ion-card-subtitle>Exp Date</ion-card-subtitle>
                    <ion-card-content v-if="item.expirationDate != ''">
                      {{ item.expirationDate }}
                    </ion-card-content>
                    <ion-card-content v-else>
                      None
                    </ion-card-content>
                    
                  </ion-card>

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
import { arrowBack, trash, pencil, reorderTwo, helpCircle, close, fastFood, add, remove, chevronDownCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { 
  alertController,
  IonPage,
  IonContent,
  IonCard,
  IonCardSubtitle,
  IonCardContent,
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
import EditStorageItemModal from "@/components/EditStorageItemModal.vue";
import storageItems from '@/services/storageItems'
import utilities from "@/ion/utilities";
import { defineComponent, ref } from 'vue';

export default defineComponent ({
  name: 'StorageItems',
  components: { 
    Header, 
    EditStorageItemModal,
    IonPage, 
    IonContent,
    IonIcon,
    IonCard,
    IonCardSubtitle,
    IonCardContent,
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
      clickedItem: NaN,
      searchInput: "",
      showTooltip: false,
      username: "",
      storageID: NaN,
      itemID: NaN,
      data: []
    }
  },
  setup() {
    const util = new utilities();

    const doRefresh = (event, refresh) => {
      setTimeout(() => {
        refresh();
        event.target.complete();
      }, 1000);
    }

    // Ion Reorder
    const doReorder = (event) => {
      event.detail.complete();
    };

    // Ion Modal
    const isEditStorageModalOpen = ref(false);
    const setEditStorageModalOpen = (state) => (isEditStorageModalOpen.value = state);

    return {
      util,

      // Functions
      doRefresh,
      doReorder,

      // Ion Modal
      isEditStorageModalOpen,
      setEditStorageModalOpen,

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
      alertCircleOutline,
    }
  },
  computed: {
    searchItems:function()  {
      return this.data.filter(item => {
        return item.title.toLowerCase().indexOf(this.searchInput.toLowerCase()) >= 0 ;
      });
    }
},
  created() {
    this.username = this.$route.params.username.toString()
    this.storageID = Number(this.$route.params.storageId)

    this.getStorageItems()
  },
  methods: {
    getStorageItems() {
      return storageItems.getAll(this.username, this.storageID)
      .then(r => this.data = r.data)
      .catch(e => console.log(e))
    },
    setClickedItem(itemID) {
      if (this.clickedItem == itemID) {
        this.clickedItem = NaN
        return
      }
      this.clickedItem = itemID;
    },
    setItemID(itemID) {
      this.itemID = itemID;
    },
    newItem() {
      let success = false;
      const payload = {title: "New Item", image: "", quantity: 1, quantityType: 'pieces', quantityThreshold: 0, expirationThreshold: 0, expirationDate: ""}
      storageItems.create(this.username, this.storageID, JSON.stringify(payload))
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getStorageItems(this.username, this.storageID)
          this.util.ionToast("Successfully created item.");
        } else {
          this.util.ionToast("Something went wrong trying to create the item.");
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
      storageItems.delete(this.username, this.storageID, itemID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully deleted item.");
          this.getStorageItems(this.username, this.storageID)
        } else {
          this.util.ionToast("Something went wrong trying to delete the item.");
        }
      })
    },
    decrementQuantity(itemID) {
      let success = false;
      storageItems.decrementQuantity(this.username, this.storageID, itemID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getStorageItems()
        } else {
          this.util.ionToast("Something went wrong trying to decrement quantity.");
        }
      })
    },
    incrementQuantity(itemID) {
      let success = false;
      storageItems.incrementQuantity(this.username, this.storageID, itemID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getStorageItems()
        } else {
          this.util.ionToast("Something went wrong trying to increment quantity.");
        }
      })
    },
    isLowQuantity(quantity, threshold) {
      if (threshold == 0) {
        return false
      }

      if (quantity < threshold) {
        return true
      }    
    },
    isExceededExp(expDate, threshold) {
        if (expDate == "" || threshold == 0) {
          return false
        }

        const expDateSeconds = Date.parse(expDate) / 1000; // Divided by 1000 to get seconds from milliseconds.
        const expThresholdDate = expDateSeconds - (threshold * 86400) // The threshold date is the expiration date minus the threshold amount of days.
        const now = Math.round(Date.now() / 1000); // Now in seconds, divided by 100 to get seconds from milliseconds.

        if (now > expThresholdDate) {
          return true
        }
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

#drop-down-wrapper {
  --min-height: 120px;
}

.drop-down-content {
  margin: 0 auto;
}

ion-card-subtitle {
  text-align: center;
  padding: 10px;
  color: var(--color-pri);
}

ion-card-content {
  padding: 10px;
  text-align: center;
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

.decrement-option {
  background:  rgb(36, 84, 112);
}

.increment-option {
  background:  rgb(45, 133, 184);
}

#item-title {
  text-align: center;
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