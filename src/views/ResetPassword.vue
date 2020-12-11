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
    type="password"
    @ionInput="password = $event.target.value;"
    placeholder="password"
    >
    </ion-input>
  </ion-item>

    <ion-item class="inputs" lines="none">
    <ion-input
    type="password"
    @ionInput="confirmPassword = $event.target.value;"
    placeholder="confirm password"
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

export default defineComponent ({
  name: 'ResetPassword',
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
      password: "",
      confirmPassword: "",
      accessToken: "",
      username: "",
      accessExpiresAt: "",
    }
  },
  created() {
    this.accessToken = this.$route.params.accessToken.toString()
    this.username = this.$route.params.username.toString()
    this.accessExpiresAt = this.$route.params.accessExpiresAt.toString()

    const now = Math.round(Date.now() / 1000);

    if (now > Number(this.accessExpiresAt)) {
      this.err = "This link has expired. You will be redirected to the login page."
      setTimeout(() => {
        this.$router.push("/login")
      }, 10000);
      return
    }

    document.cookie = `accessToken=${this.accessToken}; expires=${this.accessExpiresAt}; path=/`
    document.cookie = `username=${this.username}; expires=${this.accessExpiresAt}; path=/`
    document.cookie = `accessExpiresAt=${this.accessExpiresAt}; expires=${this.accessExpiresAt}; path=/`
  },
  methods: {
    onSubmit() {
      if (this.password == "" || this.confirmPassword == "") {
        this.err = "Fields can't be empty"
        return
      }

      if (this.password != this.confirmPassword) {
        this.err = "Passwords don't match"
        return
      }

      const payload = { password: this.password }

      let status = NaN;
      accounts.updatePassword(this.username, payload)
      .then(r => status = r.status)
      .catch(e => (status = e.response.status, this.err = e.response.data.error))
      .finally(() => {
        if (status == 204) {
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