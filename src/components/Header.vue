<template>
  <div id="container">
    
    <ion-toolbar id="main-content" class="menu-toolbar" >
      <img id="logo" src="../../public/assets/icon/catclerk.svg">
      <!-- <h3 id="logo">Cat Clerk</h3> -->
      <ion-title>{{ title }}</ion-title>
      <ion-icon class="top-right" size="large" id="menu-icon" :icon="menu" @click="openMenu()"></ion-icon>
    </ion-toolbar>

  </div>
</template>

<script lang="ts">
import { 
  IonIcon,
  IonToolbar,
  IonTitle,
  menuController,
} from '@ionic/vue';
import { menu, logoOctocat } from 'ionicons/icons';
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
  },
  setup() {
    return {
      menu,
      logoOctocat,
    }
  },
  methods: {
    async openMenu() {
      await menuController.open();
    },

  }
})
</script>

<style scoped lang="scss">
.menu-toolbar {
  text-align: center;
  height: 60px;
  padding-top: 8px;
  --background: var(--background-pri);
  color: rgb(152, 184, 199);
}

ion-title {
  margin-right: 15%;
  margin-top: 1%;
}

ion-icon {
  color: rgb(126, 155, 168);
}

#menu-icon {
  float: right;
  margin-right: 12px;
}

#logo {
  float: left;
  margin-left: 12px;
  margin-top: -5px;
  width: 50px;
}

ion-title {
  z-index: -1;
}

</style>