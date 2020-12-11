<template>
  <ion-page>
    <Header title="Contact" />
    <ion-content :fullscreen="true">

  <!-- Image -->
  <div id="img-wrapper">
      <div id="img-content">
        <img src="../../public/assets/icon/catclerk.svg" width="100">
      </div>
  </div>

  <!-- Title -->
  <ion-item lines="none">
    <ion-text style="text-align: center;" class="center">
      <h1>Cat Clerk</h1>
      <p>Aarhus, Denmark</p>
    </ion-text>
  </ion-item>

  
  <ion-item lines="none">
    <!-- Left side card -->
    <div class="contact-cards" lines="none">
      <ion-icon class="contact-cards-icons" :icon="call" size="large"></ion-icon>
      <ion-item class="contact-cards-texts" lines="none">
        <ion-text class="center">
          <p>+45 12345678</p>
        </ion-text>
      </ion-item>
    </div>

    <!-- Right side card -->
    <div class="contact-cards" lines="none">
      <ion-icon class="contact-cards-icons" :icon="mail" size="large"></ion-icon>
      <ion-item class="contact-cards-texts" lines="none">
        <ion-text class="center">
          <p>contact</p>
          <p>@catclerk.com</p>
        </ion-text>
      </ion-item>
    </div>

  </ion-item>

  <!-- Bottom map -->
  <ion-item id="map" lines="none"></ion-item>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage,
  IonContent,
  IonItem,
  IonText,
  IonIcon,
  } from '@ionic/vue';
import { mail, call } from 'ionicons/icons';
import Header from '@/components/Header.vue';

export default  {
  name: 'Contact',
  components: { 
    Header,
    IonPage,
    IonContent,
    IonItem,
    IonText,
    IonIcon,
  },
  setup() {
    return {
      mail,
      call
    }
  }
}
</script>

<style scoped lang="scss">
#img-wrapper {
  margin-top: 50px;
  display: flex;
  width: 100%;
}

#img-content {
  padding: 25px;
  margin: 0 auto;
  background: var(--background-pri);
}

.contact-cards {
  display: flex;
  float: left;
  background: var(--background-pri);
  border-radius: 5px;
  margin: 50px auto 0px auto;
  width: 42%;
  min-height: 150px;
}

.contact-cards-icons {
  margin: 15px auto;
  padding: 7px;
  border-radius: 100%;
  background: var(--background-tri);
}

.contact-cards-texts {
  position: absolute;
  bottom: 0;
  height: 38%; 
  text-align: center;
  width: 41.4%;
}

#map {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  background-image: url("../../public/assets/map.svg");
  background-repeat: repeat-x;
}


</style>