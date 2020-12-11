<template>
  <div id="container">
    <ion-item-group>
      <div v-if="data.length != 0">
      <ion-icon class="tooltip-icon" @click="showTooltip = !showTooltip" size="large" :icon="helpCircle"></ion-icon>
      <ion-card class="tooltip-card" v-if="showTooltip">
        <ion-icon class="top-right" :icon="close" @click="showTooltip = false" size="large"></ion-icon>
        You can slide items both left and right for more options. Click on an item to open up its contents.
        <br />
        <br />
        The number on the left tells you how many items there are in that shopping list.
        </ion-card>
      </div>

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event, getShoppingLists)">
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing...">
      </ion-refresher-content>
    </ion-refresher>

    <ion-list id="ionList" style="clear:both;" lines="none">
      <div v-if="data.length != 0">
        <ion-reorder-group
          id="reorderGroup"
          @ionItemReorder="doReorder($event)"
          disabled="false"
        >
          <!-- Create shoppingLists -->
          <div v-for="shoppingList in data" :key="shoppingList.id">
            <ion-item-sliding>
            <ion-item-options>
                <ion-item-option
                  class="edit-option"
                  @click="editShoppingListAlert(shoppingList.id)"
                >
                <ion-icon :icon="pencil" size="large"></ion-icon>
                </ion-item-option>
                <ion-item-option
                  class="delete-option"
                  @click="deleteShoppingListAlert(shoppingList.id)"
                >
                  <ion-icon :icon="trash" size="large"></ion-icon>
                </ion-item-option>
              </ion-item-options>

                <ion-item-options side="start">
                <ion-item-option
                  class="edit-option"
                  @click="shareShoppingListAlert(shoppingList.id, shoppingList.title)"
                >
                  <ion-icon :icon="people" size="large"></ion-icon>
                </ion-item-option>

              </ion-item-options>

              <ion-item class="data-items" lines="none" @click="enterShoppingList(shoppingList.id)">
                <ion-badge>{{shoppingList.count}}</ion-badge>
                <ion-label class="center-text">{{shoppingList.title}}</ion-label>
                <ion-reorder>
                  <ion-icon :icon="reorderTwo" size="large"></ion-icon>
                </ion-reorder>
              </ion-item>
              </ion-item-sliding>
               
          </div>
          </ion-reorder-group>
           </div>
          <div v-else>
            <ion-title>Create a new Shopping List to begin.</ion-title>
           </div>
       </ion-list>
     
    </ion-item-group>

      <ion-fab>
        <ion-fab-button @click="newShoppingList()">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>

  </div>
</template>

<script lang="ts">
import { 
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
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonBadge,
  alertController,
} from '@ionic/vue';
import { add, people, trash, pencil, reorderTwo, helpCircle, close, chevronDownCircleOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import utilities from "@/ion/utilities";
import shoppingLists from '@/services/shoppingLists'
import shareRequests from "@/services/shareRequests";


export default defineComponent({
  name: 'Menu',
  components: {
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
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonBadge,
  },
  props: {
    title: String,
  },
  data() {
    return {
      username: "",
      showTooltip: false,
      data: [],
    }
  },
  setup() {
    const util = new utilities();

    // Functions
    const doRefresh = (event: any, refresh: any) => {
      setTimeout(() => {
        refresh();
        event.target.complete();
      }, 1000);
    }

    const doReorder = (event: CustomEvent) => {
      event.detail.complete();
    };

    return {
      util,
      doRefresh,
      doReorder,
      add,
      people,
      trash,
      pencil,
      reorderTwo,
      helpCircle,
      close,
      chevronDownCircleOutline
    }
  },
  created() {
    this.username = this.$route.params.username.toString()
    this.getShoppingLists()
  },
  methods: {
    getShoppingLists() {
     return shoppingLists.getAll(this.username)
      .then(r => this.data = r.data)
      .catch(e => console.log(e))
    },
    enterShoppingList(shoppingListId: number) {
      if (this.$router.resolve("shopping-list-items-" + shoppingListId)) {
        this.$router.push("shopping-list-items-" + shoppingListId)
      }
    },
    newShoppingList() {
      const payload = {title: "New Shopping List", owner: true}
      shoppingLists.create(this.username, JSON.stringify(payload))
      .catch(e => console.log(e))
      .finally(() =>
        this.getShoppingLists()
      )
    },
    async editShoppingListAlert(shoppingListID: number) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "New name?",
        inputs: [
            {
              placeholder: "name...",
            },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
          {
            text: "Done",
            handler: data => {
              this.editShoppingList(shoppingListID, data[0]);
              this.util.ionToast("Successfully edited shopping list.");
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
        ],
      });
      return alert.present();
    },
    editShoppingList(shoppingListID: number, newTitle: string) {
      shoppingLists.patchTitle(this.username, shoppingListID, newTitle)
      .catch(e => console.log(e))
      .finally(() => {
        this.getShoppingLists();
        setTimeout(() => {
          this.getShoppingLists();
        }, 3000);
      })
    },
    async shareShoppingListAlert(shoppingListID: number, title: string) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Share your shopping list",
        message: "Insert the username to request",
        inputs: [
            {
              placeholder: "username...",
            },
        ],
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
          {
            text: "Send",
            handler: data => {
              if (data[0] == this.username) {
                this.util.ionToast("Can't share with yourself.");
                return
              }

              let isOwner = false;
              shoppingLists.getOwner(this.username, shoppingListID, data[0])
              .then(r => isOwner = r.data)
              .catch(e => console.log(e))
              .finally(() => {
                if (isOwner) {
                  this.util.ionToast("Already own this shopping list.");
                  return
                }
                this.shareShoppingList(data[0], shoppingListID, title);
                (document.getElementById("ionList") as any).closeSlidingItems();
              })
            },
          },
        ],
      });
      return alert.present();
    },
    shareShoppingList(usernameRequest: string, shoppingListID: number, title: string) {
      const payload = {toUsername: usernameRequest, shareType: "shopping_list", title: title, idRequest: shoppingListID}
      let success = false;
      shareRequests.create(this.username, JSON.stringify(payload))
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully send share storage request.");
        } else {
          this.util.ionToast("Something went wrong, is it a valid username?");
        }
      })
    },
      async deleteShoppingListAlert(shoppingListID: number) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Are you sure?",
        message: "Deleting a shopping list cannot be undone.",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
          {
            text: "Delete",
            handler: () => {
              let isOwner = false;
              shoppingLists.getOwner(this.username, shoppingListID, this.username)
              .then(r => isOwner = r.data.owner)
              .catch(e => console.log(e))
              if (isOwner) {
                this.deleteShoppingList(shoppingListID);
              } else {
                this.removeSharedShoppingList(shoppingListID);
              }
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
        ],
      });
      return alert.present();
    },
    deleteShoppingList(shoppingListID: number) {
      let success = false
      shoppingLists.delete(this.username, shoppingListID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully deleted shopping list.");
          this.getShoppingLists()
        } else {
          this.util.ionToast("Something went wrong trying to delete the shopping list.");
        }
      })
    },
    removeSharedShoppingList(shoppingListID: number) {
      let success = false;
      shoppingLists.removeShare(this.username, shoppingListID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully removed shared shopping list.");
          this.getShoppingLists()
        } else {
          this.util.ionToast("Something went wrong trying to removed the shared shopping list.");
        }
      })
    }
  }
})
</script>

<style scoped lang="scss">
ion-list {
  background: none;
  min-height: 71vh;
}

ion-item-option{
  margin-top: 1px;
  height: 68px;
  width: 68px;
}

.tooltip-icon {
  float:right;
  padding: 7px;
  color: rgb(114, 166, 199);
}

.tooltip-card {
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