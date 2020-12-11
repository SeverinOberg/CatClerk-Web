<template>
  <div id="container">

  <ion-menu side="end" content-id="main-content">
      <ion-toolbar id="menu-toolbar">
        <ion-title>Menu</ion-title>
        <ion-icon class="top-right" size="large" :icon="close" @click="closeMenu()"></ion-icon>
      </ion-toolbar>

    <ion-content>
      <ion-list>
          <ion-item routerLink="profile" lines="none" @click="closeMenu()">
            <ion-icon :icon="person"></ion-icon>
            <ion-label>Profile</ion-label>
          </ion-item>
          <ion-item routerLink="requests" lines="none" @click="closeMenu()">
            <ion-icon :icon="paperPlane"></ion-icon>
            <ion-label>
              Requests
            </ion-label>
            <ion-badge class="badge" v-if="pendingRequests > 0">
              {{ pendingRequests }}
            </ion-badge>
          </ion-item>
          <ion-item routerLink="about" lines="none" @click="closeMenu()">
            <ion-icon :icon="helpCircle"></ion-icon>
            <ion-label>About</ion-label>
          </ion-item>
          <ion-item routerLink="contact" lines="none" @click="closeMenu()">
            <ion-icon :icon="mail"></ion-icon>
            <ion-label>Contact</ion-label>
          </ion-item>
          <ion-item routerLink="settings" lines="none" @click="closeMenu()">
            <ion-icon :icon="settings"></ion-icon>
            <ion-label>Settings</ion-label>
          </ion-item>
          <ion-item detail="false" lines="none" @click="closeMenu(), logout()">
            <ion-icon :icon="logOut"></ion-icon>
            <ion-label>Log Out</ion-label>
          </ion-item>
      </ion-list>
    </ion-content>
  </ion-menu>

  </div>
</template>

<script lang="ts">
import shareRequests from '@/services/shareRequests';
import { 
  IonIcon,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonItem,
  IonList,
  IonContent,
  IonMenu,
  IonBadge,
  menuController,

} from '@ionic/vue';
import { menu, close, person, paperPlane, helpCircle, mail, settings, logOut } from 'ionicons/icons';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Menu',
  props: {
    title: String,
  },
  components: {
  IonIcon,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonItem,
  IonList,
  IonContent,
  IonMenu,
  IonBadge,
  },
  data() {
    return {
      username: "",
      pendingRequests: 0
    }
  },
  setup() {
    return {
      menu,
      close,
      person,
      paperPlane,
      helpCircle,
      mail,
      settings,
      logOut,
    }
  },
  created() {
    this.username = this.$route.params.username.toString()

    this.getRequests()
  },
  methods: {
    getRequests() {
      shareRequests.get(this.username)
      .then(r => this.pendingRequests = r.data.length)
      .catch(e => console.log(e))
    },
    async closeMenu() {
      await menuController.close();
    },
    logout() {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "accessExpiresAt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      this.$router.push("tabs/login")
    }
  }
})
</script>

<style scoped lang="scss">
ion-header {
  --ion-background-color: rgb(37, 58, 68);
}

#menu-toolbar {
  --background: var(--background-pri-hover);
   color: rgb(152, 184, 199);
   height: 60px;
   padding-top: 10px;
}

ion-menu {
  --ion-background-color: var(--background-pri);
}

ion-title {
  text-align: center;
}

ion-list {
  background: none;
}

ion-item {
   color: rgb(152, 184, 199);
  margin-top: 5px;
  --background: var(--background-pri);
  transition: all 200ms ease-in-out;
  &:hover {
    --background: var(--background-sec);
  }
}

ion-icon {
  float: right;
  margin-right: 8px;
  background: none;
  transition: all 200ms ease-in-out;
    &:hover {
      background: var(--background-sec);
      border-radius: 5px;
    }
}

.badge {
  margin-right: 10px;
  background: var(--background-danger);
}
</style>