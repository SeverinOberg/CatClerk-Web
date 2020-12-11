<template>
  <div id="container">

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event, getStorages)">
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing...">
      </ion-refresher-content>
    </ion-refresher>

   
    <ion-item-group>
    <div v-if="data.length != 0">
      <ion-icon id="tooltip-icon" @click="showTooltip = !showTooltip" size="large" :icon="helpCircle"></ion-icon>
      <ion-card id="tooltip-card" v-if="showTooltip">
        <ion-icon class="top-right" :icon="close" @click="showTooltip = false" size="large"></ion-icon>
        You can slide items both left and right for more options. Click on an item to open up its contents.
        <br />
        <br />
        The number on the left tells you how many items there are in that storage.
      </ion-card>
    </div>

    <!-- <ion-text style="padding-top:25px; padding-left:12px; position:fixed;">Items</ion-text> -->
    <ion-list id="ionList" style="clear:both;" lines="none">
      <div v-if="data.length != 0">
        <ion-reorder-group
          id="reorderGroup"
          @ionItemReorder="doReorder($event)"
          disabled="false"
        >
          <!-- Create storages -->
          <div v-for="storage in data" :key="storage.id">
            <ion-item-sliding>
            <ion-item-options>
                <ion-item-option
                  class="edit-option"
                  @click="editStorageAlert(storage.id)"
                >
                  <ion-icon :icon="pencil" size="large"></ion-icon>
                </ion-item-option>
                <ion-item-option
                  class="delete-option"
                  @click="deleteStorageAlert(storage.id)"
                >
                  <ion-icon :icon="trash" size="large"></ion-icon>
                </ion-item-option>
              </ion-item-options>

                <ion-item-options side="start">

                <ion-item-option
                  class="edit-option"
                  @click="shareStorageAlert(storage.id, storage.title)"
                >
                  <ion-icon :icon="people" size="large"></ion-icon>
                </ion-item-option>
              </ion-item-options>

              <ion-item class="data-items" lines="none" @click="enterStorage(storage.id)">
                <ion-badge>{{storage.count}}</ion-badge>
                <ion-label class="center-text">{{storage.title}}</ion-label>
                <ion-reorder>
                  <ion-icon :icon="reorderTwo" size="large"></ion-icon>
                </ion-reorder>
              </ion-item>
              </ion-item-sliding>
               
          </div>
          </ion-reorder-group>
          </div>
          <div v-else>
            <ion-title>Create a new Storage to begin.</ion-title>
          </div>
       </ion-list>


    </ion-item-group>

      <ion-fab>
        <ion-fab-button @click="newStorage()">
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
import storages from "@/services/storages.ts";
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
      isOwner: false,
      data: [],
    }
  },
  setup() {
    const util = new utilities();

    const doRefresh = (event: any, refresh: any) => {
      setTimeout(() => {
        refresh();
        event.target.complete();
      }, 1000);
    }

    // Ion Reorder
    const doReorder = (event: CustomEvent) => {
      event.detail.complete();
    };

    return {
      util,
      doRefresh,
      // Icons
      add,
      people,
      trash,
      doReorder,
      pencil,
      reorderTwo,
      helpCircle,
      close,
      chevronDownCircleOutline,
    }
  },
  created() {
    this.username = this.$route.params.username.toString()
    this.getStorages()
  },
  methods: {
    getStorages() {
     return storages.get(this.username)
      .then(r => this.data = r.data)
      .catch(e => console.log(e))
    },
    enterStorage(storageID: number) {
      if (this.$router.resolve("storage-items-" + storageID)) {
        this.$router.push("storage-items-" + storageID)
      }
    },
    newStorage() {
      const payload = {title: "New Storage", owner: true}
      storages.create(this.username, JSON.stringify(payload))
      .catch(e => console.log(e))
      .finally(() => {
        this.getStorages()
      })     
    },
    async editStorageAlert(storageID: number) {
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
              this.editStorage(storageID, data[0]);
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
        ],
      });
      return alert.present();
    },
    editStorage(storageID: number, newTitle: string) {
      const payload = {title: newTitle}
      storages.update(this.username, storageID, JSON.stringify(payload))
      .catch(e => console.log(e))
      .finally(() => {
        this.getStorages()
        this.util.ionToast("Successfully edited storage.");
      })
    },
    async shareStorageAlert(storageID: number, title: string) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Share your storage",
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
              storages.getOwner(this.username, storageID, data[0])
              .then(r => isOwner = r.data)
              .catch(e => console.log(e))
              .finally(() => {
                if (isOwner) {
                  this.util.ionToast("Already own this shopping list.");
                  return
                }
                this.shareStorage(data[0], storageID, title);
                (document.getElementById("ionList") as any).closeSlidingItems();
              })
            },
          },
        ],
      });
      return alert.present();
    },
    shareStorage(usernameRequest: string, storageID: number, title: string) {
      const payload = {toUsername: usernameRequest, shareType: "storage", title: title,  idRequest: storageID}
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
      async deleteStorageAlert(storageID: number) {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Are you sure?",
        message: "Deleting a storage cannot be undone.",
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
              storages.getOwner(this.username, storageID, this.username)
              .then(r => isOwner = r.data.owner)
              .catch(e => console.log(e))
              if (isOwner) {
                this.deleteStorage(storageID);
              } else {
                this.removeShareStorage(storageID);
              }
              (document.getElementById("ionList") as any).closeSlidingItems();
            },
          },
        ],
      });
      return alert.present();
    },
    deleteStorage(storageID: number) {
      let success = false;
      storages.delete(this.username, storageID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.util.ionToast("Successfully deleted storage.");
          this.getStorages()
        } else {
          this.util.ionToast("Something went wrong trying to delete the storage.");
        }
      })
    },
    removeShareStorage(storageID: number) {
      let success = false;
      storages.removeShare(this.username, storageID)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getStorages()
          this.util.ionToast("Successfully removed shared storage.");
        } else {
          this.util.ionToast("Something went wrong trying to remove the shared storage.");
        }
      })
    },
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