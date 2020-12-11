<template>
  <ion-page>
    <Header title="Settings" />
    <ion-content :fullscreen="true">

      <ion-item lines="none">
        <ion-label>Notifications</ion-label>
        <ion-toggle
          @ionChange="setNotification()"
          :checked="notifications"
          >
        </ion-toggle>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonToggle,
} from '@ionic/vue';
import Header from '@/components/Header.vue';
import utilities from '@/ion/utilities'
import settings from '@/services/settings'
import { defineComponent } from 'vue';

export default defineComponent ({
  name: 'Settings',
  components: { 
  Header,
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonToggle,
  },
  data() {
    return {
      username: "",
      notifications: Boolean,
    }
  },
  setup() {
    const util = new utilities();

    return {
      util
    }
  },
  created() {
    this.username = this.$route.params.username.toString()
    // Initialize settings
    this.getNotification()
  },
  methods: {
    getNotification() {
      settings.getNotification(this.username)
      .then(r => this.notifications = r.data.notifications)
      .catch(e => console.log(e))
    },
    setNotification() {
      let success = false;
      settings.toggleNotification(this.username)
      .then(r => (success = r.status == 204))
      .catch(e => console.log(e))
      .finally((() => {
        if (success) {
          this.getNotification()
          this.util.ionToast("Successfully updated notification setting.")
        } else {
          this.util.ionToast("Something went wrong updating the notfications setting.")
        }
  
      }))
    }
  }
})
</script>

<style scoped lang="scss">
ion-item {
  --border-radius: 15px;
  padding: 20px;
  font-size: 1.3rem;
  margin-bottom: 2px;
  --min-height: 70px;
  --background:var(--background-pri);
}
</style>