import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'
import helpers from '../helpers'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/sign-up',
    component: () => import('@/views/SignUp.vue')
  },
  {
    path: '/forgotten-password',
    component: () => import('@/views/ForgottenPassword.vue')
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'tab1'
      },
      {
        path: '/:pathMatch(.*)*',
        redirect: "/"
      },
      {
        path: ':username/reset-password/:accessToken/:accessExpiresAt',
        component: () => import('@/views/ResetPassword.vue')
      },
      {
        path: ':username/tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: ':username/tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: ':username/tab3',
        component: () => import('@/views/Tab3.vue')
      },
      {
        path: ':username/storage-items-:storageId',
        component: () => import('@/views/StorageItems.vue')
      },
      {
        path: ':username/shopping-list-items-:shoppingListId',
        component: () => import('@/views/ShoppingListItems.vue')
      },
      {
        path: ':username/profile',
        component: () => import('@/views/Profile.vue')
      },
      {
        path: ':username/requests',
        component: () => import('@/views/Requests.vue')
      },
      {
        path: ':username/about',
        component: () => import('@/views/About.vue')
      },
      {
        path: ':username/contact',
        component: () => import('@/views/Contact.vue')
      },
      {
        path: ':username/settings',
        component: () => import('@/views/Settings.vue')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

const publicPages = ["/sign-up", "/login", "/forgotten-password", "/reset-password"];

// Authenticate paths
router.beforeEach((to, from, next) => {
  const authRequiredSites = !publicPages.includes(to.path);
  const user = helpers.getCookie('username')
  const accessExpiresAt = Number(helpers.getCookie('accessExpiresAt'))

  if (to.path.includes("/reset-password")) {
    next();
    return
  }

  if (user != undefined) {
    if (Math.floor(Date.now() / 1000) > accessExpiresAt) {
      document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "accessExpiresAt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return next("/login");
    }
  }

  if (user == undefined && authRequiredSites) { 
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessExpiresAt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return next("/login");
  }

  next();
});