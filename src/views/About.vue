<template>
  <ion-page>
    <Header title="About" />
    <ion-content :fullscreen="true">
      <div id="content">

      <div id="img-wrapper">
        <div id="img-content">
        <img src="../../public/assets/icon/catclerk.svg" width="100">
        </div>
      </div>

      <div class="full-width">
        <ion-text class="center" style="font-size: 1.7rem; font-weight: bold;">Cat Clerk</ion-text>
      </div>
      <div class="full-width">
        <ion-card class="center" style="height: 20%; padding: 10px;">
          <div class="full-width">
            <ion-text class="center" style="font-weight: bold; text-align: center;">
              <h5>Your personal kitchen <br /> storage manager</h5>
            </ion-text>
          </div>
          
          <div class="full-width" style="padding-top: 20px;">
            <ion-text>
               <p>At Cat Clerk we take pride in being the go to app choice for helping you have the ease of mind in your kitchen
                 that you deserve. Supporting you to keep your cabinets more tidy and saving the world(slightly) in the process by reducing
                 waste and spillage. We take great joy in listening to our customers feedback, so do not hesitate to contact us!
               </p>
            </ion-text>
          </div>

          <div class="full-width" style=" bottom: 0; left: 0; padding: 10px;">
            <ion-text>Thank you for using Cat Clerk.</ion-text>
          </div>
        </ion-card>
      </div>


      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage,
  IonContent,
  IonText,
  IonCard,
} from '@ionic/vue';
import Header from '@/components/Header.vue';

export default  {
  name: 'About',
  components: { 
    Header,
    IonPage,
    IonContent ,
    IonText,
    IonCard,
  }
}
</script>

<style scoped lang="scss">
#content {
  height: 120%;
}

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

ion-card {
  // --min-height: 600px;
  --background:var(--background-pri);
  color: #ddd;
  margin-top: 35px;
  width: 35vh;
  height: 40vh;
}
</style>