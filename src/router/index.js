import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from "@/views/HomeView.vue";
import VirusesView from '@/views/VirusesView.vue'
import BankAccountView from '@/views/BankAccountView.vue'
import ShopView from '@/views/ShopView.vue'

Vue.use(VueRouter)

const routes = [
    
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/shop',
    name: 'shopmain',
    component: ShopView,
    children: [
      {
       path: 'home',
        name: 'shophome',
        components: {
          center: HomeView,
        },
        alias:'/shop'
      },
      {
        path: 'login',
        name: 'shoplogin',
        components: {
          center: HomeView,
        }
      },
      {
        path: 'buy',
        name: 'shopbuy',
        components: {
          center: HomeView,
        }
      },
      {
        path: 'pay/:orderId',
        name: 'shoppay',
        components: {
          center: HomeView,
        }
      },
      {
        path: 'orders',
        name: 'shoporders',
        components: {
          center: HomeView,
        }
      },
    ]
  },
  {
    path: '/shop/items',
    name: 'shopitems',
    component: VirusesView
  },
  {
    path: '/bank/account',
    name: 'bankaccount',
    component: BankAccountView
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
