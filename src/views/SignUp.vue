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
    @ionInput="email = $event.target.value;"
    name="email"
    placeholder="email"
  >
  </ion-input>
</ion-item>

<ion-item class="inputs" lines="none">
  <ion-input
    type="text"
    @ionInput="username = $event.target.value;"
    name="username"
    placeholder="username"
   >
   </ion-input>
</ion-item>

<ion-item class="inputs" lines="none">
  <ion-input
    type="password"
    @ionInput="password = $event.target.value;"
    name="username"
    placeholder="password"
   >
   </ion-input>
</ion-item>

<ion-item class="inputs" lines="none">
  <ion-input
    type="password"
    @ionInput="confirmPassword = $event.target.value;"
    name="username"
    placeholder="confirm password"
   >
   </ion-input>
</ion-item>

<ion-item style="margin-top: 10px;" lines="none">
  <ion-button type="submit">Sign Up</ion-button>
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
import accounts from '@/services/accounts';

export default defineComponent ({
  name: 'SignUp',
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
      username: "",
      password: "",
      confirmPassword: "",
    }
  },
  methods: {
    onSubmit() {
      switch("") {
        case this.email:
        this.err = "Email can not be empty"
          return
        case this.username:
        this.err = "Username can not be empty"
          return
        case this.password:
        this.err = "Password can not be empty"
          return
        case this.confirmPassword:
        this.err = "Confirm password can not be empty"
          return
      }

      if (this.password != this.confirmPassword) {
        this.err = "Passwords don't match"
        return
      }

      const payload = {
        email: this.email,
        username: this.username,
        password: this.password,
      }

      let success = false;
      accounts.create(payload)
      .then(r => (success = r.status == 204, console.log(r)))
      .catch(e => (this.err = e.response.error, console.log(e)))
      .finally(() => {
        if (success) {
          this.$router.push("/login")
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