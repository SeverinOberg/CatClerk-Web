<template>
  <ion-page>
    <Header title="Shopping List"/>
    <ion-content :fullscreen="true">
    <ShoppingList />

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import ShoppingList from '@/components/ShoppingList.vue'

export default defineComponent ({
  name: 'Tab2',
  components: { 
  Header,
  ShoppingList,
  IonPage,
  IonContent
}
})
</script>