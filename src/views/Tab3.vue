<template>
  <ion-page>
    <Header title="Recipes"/>
    <ion-content :fullscreen="true">
      
      <ion-title>Coming soon...</ion-title>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage,
  IonContent,
  IonTitle,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';

export default defineComponent ({
  name: 'Tab3',
  components: { 
  Header,
  IonPage,
  IonContent,
  IonTitle,
 }
})
</script>