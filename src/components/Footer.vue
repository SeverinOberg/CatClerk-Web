<template>
  <div id="container">
      <ion-item routerLink="tab1" lines="none">
        <ion-icon class="icons" :icon="fastFood"></ion-icon>
      </ion-item>
      <ion-item routerLink="tab2" lines="none">
        <ion-icon class="icons" :icon="receipt"></ion-icon>
      </ion-item>
      <ion-item routerLink="tab3" lines="none">
        <ion-icon class="icons" :icon="book"></ion-icon>
      </ion-item>
  </div>
</template>

<script lang="ts">
import { 
  IonIcon,
  IonItem,
  menuController,
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { list, star, book, receipt, fastFood } from 'ionicons/icons';

export default defineComponent({
  name: 'Menu',
  props: {
    title: String,
  },
  components: {
  IonIcon,
  IonItem,
  },
  setup() {
    return {
      list,
      star,
      book,
      receipt,
      fastFood,
    }
  },
  methods: {
    async openMenu() {
      await menuController.open()
    }
  }
})
</script>

<style scoped lang="scss">
ion-item {
  display: inline-block;
  margin-bottom: -5px;
  --min-height: 55px;
  --background:var(--background-pri);
  color: #ddd;
  width: 33.3333%;
  &:hover {
    color: #fff;
    --background:var(--background-pri-hover);
  }
}

.icons {
  margin: 0px auto;
}

</style>