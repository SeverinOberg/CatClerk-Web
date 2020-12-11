<template>
  <ion-app>
    <MenuModal v-if=" 
    !this.$route.path.match('/login') && 
    !this.$route.path.match('/sign-up') &&
    !this.$route.path.match('/forgotten-password') &&
    !this.$route.path.match('/reset-password')
    "
    />

    <ion-router-outlet />

    <Footer v-if="
    !this.$route.path.match('/items') && 
    !this.$route.path.match('/login') && 
    !this.$route.path.match('/sign-up') &&
    !this.$route.path.match('/forgotten-password') &&
    !this.$route.path.match('/reset-password')
    "
    />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent } from 'vue';
import { list, star, book } from 'ionicons/icons';
import MenuModal from '@/components/MenuModal.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    MenuModal,
    Footer,
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    return {


      // Icons
      list, 
      star, 
      book,
    }
  },
});
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

ion-app {
  background: var(--background-sec);
}

ion-router-outlet {
  --ion-background-color: var(--background-sec);
 }

ion-item {
  --background: none;
}

ion-button {
  --background: var(--background-tri);
  --background-activated: var(--background-tri-hover);
  width: 80%;
  height: 40px;
  margin: 0 auto;
}

ion-badge {
  padding: 7px;
  font-size: 1.2rem;
  background: var(--background-sec);
}

ion-fab {
  position: sticky;
  float: right;
  bottom: 12%;
  right: 4%;
  z-index: 0;
}

ion-fab-button {
  --background: var(--background-qua);
}

.input-clear-icon.sc-ion-input-ios {
  background-image: url("data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><path%20fill='rgb%28255,255,255%29'%20d='M403.1,108.9c-81.2-81.2-212.9-81.2-294.2,0s-81.2,212.9,0,294.2c81.2,81.2,212.9,81.2,294.2,0S484.3,190.1,403.1,108.9z%20M352,340.2L340.2,352l-84.4-84.2l-84,83.8L160,339.8l84-83.8l-84-83.8l11.8-11.8l84,83.8l84.4-84.2l11.8,11.8L267.6,256L352,340.2z'/></svg>") !important;
}

.input-clear-icon.sc-ion-input-md {
  background-image: url("data:image/svg+xml;charset=utf-8,<svg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20512%20512'><polygon%20fill='rgb%28255,255,255%29'%20points='405,136.798%20375.202,107%20256,226.202%20136.798,107%20107,136.798%20226.202,256%20107,375.202%20136.798,405%20256,285.798%20375.202,405%20405,375.202%20285.798,256'/></svg>") !important;
}

ion-card {
  --background: var(--background-pri);
  --color: var(--color-tri);
}

.search-input {
  --background: var(--background-sec-hover);
}

.data-items {
  font-size: 1.3rem;
  margin-bottom: 2px;
  --min-height: 70px;
  --background: var(--background-pri);
  &:hover {
    --background:var(--background-pri-hover);
  }
}

.top-right {
  position: fixed;
  float:right;
  top: 0;
  right: 0;
  padding: 10px;
  color: #ddd;
}

.center {
  margin: 0 auto;
}

.center-text {
  text-align: center;
}

.full-width {
  display: flex;
  width: 100%;
}

.edit-option {
  background: var(--background-qua);
}

.delete-option {
  background: var(--background-danger);
}

.inputs {
  --background: var(--background-tri);
  padding: 15px;
  --padding-start: 20px;
  --border-radius: 4px;
  border-radius: 4px;
}

.input-labels {
  margin-left: 20px;
}

.error-wrapper {
  width: 80%;
  margin: 0 auto;
  background: var(--background-tri);
  border-radius: 10px;
}

.error-content {
  margin: 0 auto;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-transition: "color 9999s ease-out, background-color 9999s ease-out";
    -webkit-transition-delay: 9999s;
    transition: "color 9999s ease-out, background-color 9999s ease-out";
    transition-delay: 9999s;
}
/*Change text in autofill textbox*/
input:-webkit-autofill {
    -webkit-text-fill-color: #ddd !important;
}

.header-wrapper {
  height: 30vh;
  width: 100%;
  background: var(--background-pri);
  text-align:center;
}

.header-content {
  padding-top: 50px;
}

.main-title {
  font-size: 2rem;
  text-align: center;
  height: 70%;
}

.forgot-pass {
  text-decoration: none;
  color: var(--color-sec);
  width: 100%;
  margin: 0 auto;
}

</style>