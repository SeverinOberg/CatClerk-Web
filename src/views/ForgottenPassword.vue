<template>
  <div id="container">
    <ion-page>
      <ion-header>
        <div class="header-wrapper">
          <div class="header-content">
          <img class="logo" src="../../public/assets/icon/icon.png" width="90">
          <ion-title size="large" class="main-title">Cat Clerk</ion-title>
          </div>
        </div>
      </ion-header>
      
<ion-content :fullscreen="true">

<form @submit.prevent="onSubmit">

  <ion-item class="inputs" lines="none">
    <ion-input
    type="email"
    @ionInput="email = $event.target.value"
    placeholder="email"
    >
    </ion-input>
  </ion-item>

  <ion-item lines="none">
    <ion-button type="submit">Submit</ion-button>
  </ion-item>

  <div style="text-align:center; margin-bottom: 10px;">
    <a class="forgot-pass" href="/login">
      <ion-label>Already signed up?</ion-label>
    </a>
  </div>

  <ion-item v-if="err" class="error-wrapper" lines="none">
    <ion-text class="error-content">{{ err }}</ion-text>
  </ion-item>

</form>

</ion-content>
</ion-page>
</div>
</template>

<script lang="ts">
import {
  IonPage, 
  IonContent,
  IonTitle,
  IonHeader,
  IonLabel,
  IonInput,
  IonButton,
  IonItem,
  IonText,
} from '@ionic/vue';
import { defineComponent } from 'vue';

import accounts from '@/services/accounts'
import mail from '@/services/mail'

export default defineComponent ({
  name: 'ForgottenPassword',
  components: { 
  IonPage,
  IonContent,
  IonTitle,
  IonHeader,
  IonLabel,
  IonInput,
  IonButton,
  IonItem,
  IonText,
  },
  data() {
    return {
      err: "",
      email: "",
    }
  },
  methods: {
    onSubmit() {
      if (this.email == "") {
        this.err = "Email can't be empty"
        return
      }

      const payload = {email: this.email}

      let status = NaN;
      mail.create(this.email)
      .then(r => status = r.status)
      .catch(e => status = e.response.status)
      .finally(() => {
        if (status == 404) {
          this.err = "No such email found"
          return
        }
        if (status == 204) {
          this.$router.push("/login")
        } else {
          this.err = "Something went wrong"
          return
        }
      })
    }
  }
})
</script>

<style scoped lang="scss">
ion-item ion-button {
  margin-bottom: 10px;
}
</style>