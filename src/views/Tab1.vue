<template>
  <ion-page>
    <Header title="Storage" />
    <ion-content :fullscreen="true">

      <Storage />

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { defineComponent } from 'vue';
import Header from '@/components/Header.vue';
import Storage from '@/components/Storage.vue';

import utilities from '@/ion/utilities'
import storageItems from '@/services/storageItems'
import storages from '@/services/storages'
import settings from '@/services/settings'
import shareRequests from '@/services/shareRequests'

export default defineComponent ({
  name: 'Tab1',
  components: { 
  Header,
  Storage,
  IonPage,
  IonContent
  },
  setup() {

  const util = new utilities();

  // Functions
  const startJob = (username: string) => {
  
  let wantsNotifications = false;
  settings.getNotification(username)
  .then(r => wantsNotifications = r.data.notifications)
  .catch(e => console.log(e))
  .finally(() => {

  if (wantsNotifications) {
  setTimeout(() => {

    let share = [];
    // Share requests notifications
    shareRequests.get(username)
    .then(r => (share = r.data, console.log(r.data)))
    .catch(e => console.log(e))
    .finally(() => {
      if (share.length > 0) {
        const now = new Date(Date.now());
        util.localNotification(
          `You have a share request pending!`,
          ``,
          0,
          now
          )
      }
    })

    // Low storage or expired notifications
    let s = [] as any;
    const si = [] as any

    // Gather all items in all storages.
    storages.get(username)
    .then(r => s = r.data)
    .catch(e => console.log(e))
    .finally(() => {
      for (let i = 0; i < s.length; i++) {
      storageItems.getAll(username, s[i].id)
      .then(r => si.push(r.data))
      .catch(e => console.log(e))
      .finally(() => {

      const secondsMin = 30
      const secondsMax = 600

      let didExceedAmount = false
      let didExceedExp = false

      // Check if any values are below their threshold. If they are, send a notification.
      for (let i = 0; i < si.length; i++) {
        if (didExceedExp && didExceedAmount) {
          return
        }
        for (let j = 0; j < si[i].length; j++) {

          const item = si[i][j]
          
          if (!didExceedAmount) {
          if (item.quantity < item.quantityThreshold) {
            if (item.quantityThreshold == 0) {
              continue
            }


            // const notifyAtDate = new Date(Date.now() + 1000 * Math.floor(Math.random() * secondsMax) + secondsMin);

            // util.localNotification(
            //   `You're low on ${item.title}!`,
            //   `Your '${item.title}' amount(${item.quantity}) is below the wanted amount of ${item.quantityThreshold}.`, 
            //   item.id, 
            //   notifyAtDate,
            // )
            util.localNotification(
              "You're low on storage",
              "Your storage is in need of updating", 
              item.id, 
              new Date(Date.now()),
            )
            didExceedAmount = true;
          }

          }

          if (!didExceedExp) {
        
          if (item.expirationDate == "" && item.expirationThreshold == 0) {
            continue
          }

          const expDate = Date.parse(item.expirationDate) / 1000; // Divided by 1000 to get seconds from milliseconds.
          const expThresholdDate = expDate - (item.expirationThreshold * 86400) // The threshold date is the expiration date minus the threshold amount of days.
          const now = Math.round(Date.now() / 1000); // Now in seconds, divided by 100 to get seconds from milliseconds.

          if (now > expThresholdDate) {
             
              // const newThresholdDate = new Date(0)
              // const newExpDate = new Date(0)
              // newThresholdDate.setSeconds(expThresholdDate)
              // newExpDate.setSeconds(expDate)
              // const notifyAtDate = new Date(Date.now() + 1000 * Math.floor(Math.random() * secondsMax) + secondsMin);
              // util.localNotification(
              //   "Expiration date exceeded",
              //   `Your '${item.title}' exceeded its threshold date '${newThresholdDate.toISOString().substr(0, 10)}'. The expiration date is '${newExpDate.toISOString().substr(0, 10)}'. Expiration threshold is '${item.expirationThreshold}' days.`, 
              //   item.id, 
              //   notifyAtDate)

              util.localNotification(
                "Expiration date exceeded",
                "Your storage is in need of updating", 
                item.id, 
                new Date(Date.now()),
              )
              didExceedExp = true
            }
          }

          }
        }
      })
    }
  })

  }, 1000);
  }
}
  )}

    return {
      util,
      startJob,
    }
  },
  mounted() {
    this.startJob(this.$route.params.username.toString());
  }
})
</script>