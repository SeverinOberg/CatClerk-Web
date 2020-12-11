<template>
  <div id="container">
    <ion-page>
      <ion-header>
        <div class="header-wrapper">
          <div class="header-content">
          <img class="header-logo" src="../../public/assets/icon/icon.png" width="90">
          <ion-title size="large" class="main-title" style="color:#fff;">Cat Clerk</ion-title>
         
          </div>
          
        </div>
         
      </ion-header>
      
      <ion-content :fullscreen="true">

          <form @submit.prevent="Login()">
            <ion-item class="inputs" lines="none">
              <ion-input 
                @input="login = $event.target.value"
                placeholder="username"
              >
              </ion-input>
            </ion-item>    
         
            <ion-item class="inputs" lines="none">
            <ion-input 
              @input="password = $event.target.value"
              type="password"
              placeholder="password"
            >
            </ion-input>
            </ion-item>

            <ion-item @click="Login()" style="margin-top: 10px;" lines="none">
              <ion-button>Login</ion-button>
            </ion-item>
            
            <ion-item href="/sign-up" detail="false" lines="none">
              <ion-button>Sign Up</ion-button>
            </ion-item>
          
            <div style="text-align:center; margin-bottom: 20px;">
            <a class="forgot-pass" href="/forgotten-password">
              <ion-label>Forgot password?</ion-label>
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

import http from "@/http-common";

export default defineComponent({
  name: 'Login',
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
      login: "",
      password: "",
      response: {
        data: {
          accessToken: "",
          username: "",
          error: "",
        },
        status: 0,
      },
    }
  },
  methods: {
    Login() {
      http.post(
          "login",
          JSON.stringify({
            username: this.login,
            email: this.login,
            password: this.password
          })
        )
        .then(r => {
          this.response = r
          if (r.data.accessToken && r.status === 200) {
            document.cookie = `accessToken=${r.data.accessToken}; expires=${r.data.accessExpiresAt}; path=/`
            document.cookie = `username=${r.data.username}; expires=${r.data.accessExpiresAt}; path=/`
            document.cookie = `accessExpiresAt=${r.data.accessExpiresAt}; expires=${r.data.accessExpiresAt}; path=/`
          }
        })
        .then(() => this.$router.push(`/tabs/${this.response.data.username}/tab1`))
        .then(() => {location.reload()})
        .catch(e => (this.err = "username or password does not match", console.log(e)))
    }
  }
})
</script>

<style scoped lang="scss">
#forgot-pass {
  text-decoration: none;
  color: var(--color-sec);
  width: 100%;
  margin: 0 auto;
}

ion-item ion-button {
  margin-bottom: 10px;
}

</style>