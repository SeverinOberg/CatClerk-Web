<template>
  <ion-page>
    <Header title="Requests"/>
    <ion-content :fullscreen="true">

    <ion-refresher slot="fixed" @ionRefresh="doRefresh($event, getShareRequests)">
      <ion-refresher-content
        :pulling-icon="chevronDownCircleOutline"
        pulling-text="Pull to refresh"
        refreshing-spinner="circles"
        refreshing-text="Refreshing...">
      </ion-refresher-content>
    </ion-refresher>

      <div v-if="data.length != 0">
      <ion-item v-for="request in data" :key="request.id" lines="none">
        <ion-icon v-if="request.shareType == 'shopping_list'" :icon="star"></ion-icon>
        <ion-icon v-else :icon="list"></ion-icon>
        <ion-text id="from">{{request.fromUsername}}</ion-text>
        <ion-text id="from">{{request.title}}</ion-text>
        <ion-label>
          <ion-icon class="icon-buttons" color="danger" @click="deleteRequest(request.id)" :icon="close"></ion-icon>
          <ion-icon class="icon-buttons"  @click="acceptRequest(request.shareType, request.idRequest, request.id)" :icon="checkmark"></ion-icon>
        </ion-label>
      </ion-item>
      </div>
      <div v-else>
        <ion-title>You have no requests right now.</ion-title>
      </div>


    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonText,
  IonTitle,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import { close, checkmark, list, star, chevronDownCircleOutline } from 'ionicons/icons';
import Header from '@/components/Header.vue';
import storages from "@/services/storages.ts";
import shoppingLists from "@/services/shoppingLists.ts";
import shareRequests from "@/services/shareRequests";
import { defineComponent } from 'vue';
import Utilities from '@/ion/utilities';

export default  defineComponent({
  name: 'Requests',
  components: { 
    Header,
    IonPage,
    IonContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonText,
    IonTitle,
    IonRefresher,
    IonRefresherContent,
  },
  data() {
    return {
      username: "",
      data: [],
    }
  },
  setup() {
    const util = new Utilities();

    // Functions
    const doRefresh = (event: any, refresh: any) => {
      setTimeout(() => {
        refresh();
        event.target.complete();
      }, 1000);
    }

    return {
      util,
      // Functions
      doRefresh,

      // Icons
      close,
      checkmark,
      list,
      star,
      chevronDownCircleOutline,
    }
  },
  created() {
    this.username = this.$route.params.username.toString()
  
    this.getShareRequests()
  },
  methods: {
    getShareRequests() {
      return shareRequests.get(this.username)
      .then(r => this.data = r.data)
      .catch(e => console.log(e))
    },
    deleteRequest(shareID: number) {
      let success = false;
      shareRequests.delete(this.username, shareID)
      .then(r => success = r.status == 204)
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getShareRequests()
          .finally(() => this.util.ionToast("The request has been deleted."))
        } else {
          this.util.ionToast("Something went wrong while deleting the request.")
        }
      })
    },
    acceptRequest(shareType: string, idRequest: number, shareID: number) {
      let success = false;
      if (shareType == "shopping_list") {
        shoppingLists.share(this.username, idRequest)
        .then(r => success = r.status == 204)
        .catch(e => console.log(e))
        .finally(() => {
          if (success) {
            shareRequests.delete(this.username, shareID)
            .catch(e => console.log(e))
            .finally(() => {
              this.getShareRequests()
              .finally(() => {
                this.util.ionToast("Successfully accepted the request.")
              })
            })
          } else {
            this.util.ionToast("Something went wrong, try again.")
          }
        })
      } else {
          storages.share(this.username, idRequest)
          .then(r => success = r.status == 204)
          .catch(e => console.log(e))
          .finally(() => {
            if (success) {
              shareRequests.delete(this.username, shareID)
              .catch(e => console.log(e))
              .finally(() => {
                this.getShareRequests()
                .finally(() => {
                  this.util.ionToast("Successfully accepted the request.")
                })
              })
            } else {
              this.util.ionToast("Something went wrong, try again.")
            }
          })
        }
      }
  }
})
</script>

<style scoped lang="scss">
ion-item {
  --min-height: 60px;
  margin: 20px 10px 0px 10px;
  border-radius: 5px;
  --background: var(--background-pri)
}

.icon-buttons {
  font-size: 3rem;
  float: right;
}

#from {
  margin: 20px;
}


</style>