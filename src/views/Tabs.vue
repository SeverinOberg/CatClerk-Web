<template>
  <ion-page>

    <ion-tabs>
      <ion-tab-bar>
        <ion-tab-button tab="tab1" href="/tab1">
          <ion-icon :icon="list" />
        </ion-tab-button>
          
        <ion-tab-button tab="tab2" href="/tab2">
          <ion-icon :icon="star" />
        </ion-tab-button>
        
        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon :icon="book" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

  </ion-page>
</template>

<script lang="ts">
import { menuController, IonTabBar, IonTabButton, IonTabs,  IonIcon, IonPage } from '@ionic/vue';
import { list, star, book } from 'ionicons/icons';

export default {
  name: 'Tabs',
  components: {  IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage },
  setup() {
    return {
      list, 
      star, 
      book,
    }
  },
  methods: {
    async closeMenu() {
      await menuController.close()
    }
  }
}
</script>

<style scoped lang="scss">
ion-tab-bar {
//   --ion-background-color: rgb(25, 47, 58);
//   border: none;
    height: 0px; 
}


// ion-tab-button {
//   color: rgb(126, 155, 168);
//   &:hover {
//     color: #ddd;
//   }
// }

</style>