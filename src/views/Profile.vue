<template>
<ion-page>
  <Header title="Profile" />
<ion-content :fullscreen="true">
  <div id="wrapper">  

<ion-refresher slot="fixed" @ionRefresh="doRefresh($event, refreshData)">
  <ion-refresher-content
    :pulling-icon="chevronDownCircleOutline"
    pulling-text="Pull to refresh"
    refreshing-spinner="circles"
    refreshing-text="Refreshing...">
  </ion-refresher-content>
</ion-refresher>

<ion-list>
  <ion-item lines="none">
    <ion-input 
      class="inputs"
      type="email"
      :value="email"
      @ionInput="email = $event.target.value;"
      placeholder="e-mail"
    ></ion-input>
    <ion-button @click="updateEmail">
      <ion-text>Update</ion-text>
    </ion-button>
  </ion-item>

   <ion-item lines="none">
    <ion-input 
      class="inputs"
      type="text"
      :value="username"
      @ionInput="usernameInput = $event.target.value;"
      placeholder="username"
    ></ion-input>
    <ion-button @click="alertUpdateUsername">
      <ion-text>Update</ion-text>
    </ion-button>
  </ion-item>

   <ion-item id="password-item" lines="none">
      <ion-input 
        class="inputs"
        type="password"
        :value="password"
        @ionInput="password = $event.target.value;"
        placeholder="password"
      ></ion-input>
    </ion-item>

  <ion-item lines="none">
    <ion-input 
      class="inputs"
      type="password"
      :value="confirmPassword"
      @ionInput="confirmPassword = $event.target.value;"
      placeholder="confirm password"
    ></ion-input>
    <ion-button @click="updatePassword">
      <ion-text>Update</ion-text>
    </ion-button>
  </ion-item>

  <ion-item v-if="err" class="error-wrapper" lines="none">
    <ion-text class="error-content">{{ err }}</ion-text>
  </ion-item>
</ion-list>

<div id="cards-wrapper">
  <div class="cards-content-wrapper">
    <ion-text class="text-left">Storages</ion-text>
    <ion-text class="text-right">Items</ion-text>
    <ion-card>
      <ion-text class="number-left">{{ storagesCount }}</ion-text>
      <ion-text class="number-right">{{ storageItemsCount }}</ion-text>
    </ion-card>
  </div>
  <div class="cards-content-wrapper">
    <ion-text class="text-left">Shopping Lists</ion-text>
    <ion-text class="text-right">Items</ion-text>
    <ion-card>
      <ion-text class="number-left">{{ shoppingListsCount }}</ion-text>
      <ion-text class="number-right">{{ shoppingListItemsCount }}</ion-text>
    </ion-card>
  </div>
</div>

</div>

</ion-content>
</ion-page>
</template>

<script lang="ts">
import { chevronDownCircleOutline } from 'ionicons/icons';
import { 
  IonPage,
  IonContent,
  IonItem,
  IonText,
  IonButton,
  IonInput,
  IonList,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  alertController,
} from '@ionic/vue';

import Header from '@/components/Header.vue';
import utilities from '@/ion/utilities';
import { defineComponent } from 'vue';

import accounts from '@/services/accounts';
import storages from '@/services/storages';
import storageItems from '@/services/storageItems';
import shoppingLists from '@/services/shoppingLists';
import shoppingListItems from '@/services/shoppingListItems';

export default defineComponent ({
  name: 'Profile',
  components: { 
    Header,
    IonPage,
    IonContent,
    IonItem,
    IonText,
    IonButton,
    IonInput,
    IonList,
    IonCard,
    IonRefresher,
    IonRefresherContent,
  },
  data() {
    return {
      err: "",
      username: "",
      email: "",
      usernameInput: "",
      password: "",
      confirmPassword: "",
      storagesCount: 0,
      storageItemsCount: 0,
      shoppingListsCount: 0,
      shoppingListItemsCount: 0,
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

    return {
      util,
      doRefresh,
      chevronDownCircleOutline,
    }
  },
  created() {
    this.username = this.$route.params.username.toString();
    this.usernameInput = this.username
    this.getEmail();
    this.getStoragesCount();
    this.getStorageItemsCount();
    this.getShoppingListsCount();
    this.getShoppingListItemsCount();
  },
  methods: {
    getEmail() {
      accounts.getEmail(this.username)
      .then(r => this.email = r.data.email)
      .catch(e => console.log(e))
    },
    updateEmail() {
      let success = false;
      accounts.updateEmail(this.username, this.email)
      .then(r => (this.email = r.data.email, success = r.status == 204))
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          this.getEmail()
          this.util.ionToast("Successfully updated email.");
        } else {
          this.util.ionToast("Something went wrong trying to update your email.");
        }
      })
    },
    async alertUpdateUsername() {
      const alert = await alertController.create({
        cssClass: "my-custom-class",
        header: "Change Username?",
        message: "This will log you out.",
        buttons: [
          {
            text: "No",
            role: "cancel",
            cssClass: "secondary",
          },
          {
            text: "Yes",
            handler: () => {
              this.updateUsername();
            },
          },
        ],
      });
      return alert.present();
    },
    updateUsername() {
      let success = false;
      accounts.updateUsername(this.username, this.usernameInput)
      .then(r => success = r.status == 204)
      .catch(e => console.log(e))
      .finally(() => {
        if (success) {
          document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "accessExpiresAt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          this.$router.push("/login")
          this.util.ionToast("Successfully updated username, logging out...");
        } else {
          this.util.ionToast("Something went wrong trying to update your username.");
        }
      })
    },
    updatePassword() {
      this.err = ""
      if (this.password != this.confirmPassword) {
        this.err = "Passwords don't match"
        return
      }
      let success = false;
      const payload = { password: this.password }
      accounts.updatePassword(this.username, payload)
      .then(r =>  success = r.status == 204)
      .catch(e => (console.log(e), this.err = e.response.data.error))
      .finally(() => {
        if (success) {
          this.password = ""
          this.confirmPassword = ""
          this.util.ionToast("Successfully updated password.");
        } else {
          this.util.ionToast("Something went wrong trying to update your password.");
        }
      })
    },
    refreshData() {
      this.getEmail()
      this.getStoragesCount()
      this.getStorageItemsCount()
      this.getShoppingListsCount()
      this.getShoppingListItemsCount()
    },
    getStoragesCount() {
      storages.getCount(this.username)
      .then(r => this.storagesCount = r.data)
      .catch(e => console.log(e))
    },
    getStorageItemsCount() {
      storageItems.getCount(this.username)
      .then(r => this.storageItemsCount = r.data)
      .catch(e => console.log(e))
    },
    getShoppingListsCount() {
      shoppingLists.getCount(this.username)
      .then(r => this.shoppingListsCount = r.data)
      .catch(e => console.log(e))
    },
    getShoppingListItemsCount() {
      shoppingListItems.getCount(this.username)
      .then(r => this.shoppingListItemsCount = r.data)
      .catch(e => console.log(e))
    }
  }
})
</script>

<style scoped lang="scss">
#wrapper {
  height: 120%;
}

#cards-wrapper {
  width: 100%;
 
}

.cards-content-wrapper {
  width: 80%;
  margin: 60px auto;

}

ion-card {
  margin: 0 auto;
  width: 80%;
  padding: 20px;

  border-radius: 30px;
}

ion-card ion-text {
  font-size: 1.5rem;
}

.text-left {
  float: left;
  margin-left: 50px;
 
}

.text-right {
  float: right;
  margin-right: 60px;

}

.number-left {
  float: left;
  margin-left: 30px;

}

.number-right {
  float: right;
  margin-right: 30px;

}

ion-list {
  background: none;
}

ion-item {
  margin-top: 25px;
}

ion-input {
  margin-right: 10px;
  width: 200px;
  --padding-start: 20px !important;
}

#password-item {
  width: 74%;
}

ion-button {
  --background: var(--background-pri);
  --background-activated: var(--background-sec-hover);
  width: 12vh;
  font-size: 0.9rem;
}

</style>