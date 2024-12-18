import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from "@/views/HomeView.vue";
import VirusesView from '@/views/VirusesView.vue'
import BankAccountView from '@/views/BankAccountView.vue'
import ShopView from '@/views/ShopView.vue'
import ShopLoginView from '@/views/ShopLoginView.vue'
import ShopPay from '@/views/ShopPay.vue'
import ShopBuy from '@/views/ShopBuy.vue';
import ShopOrder from '@/views/ShopOrder.vue';

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
      },
      {
        path: 'login',
        name: 'shoplogin',
        components: {
          center: ShopLoginView,
        }
      },
      {
        path: 'buy',
        name: 'shopbuy',
        components: {
          center: ShopBuy,
        }
      },
      {
        path: 'pay/:orderId?',
        name: 'shoppay',
        components: {
          center: ShopPay,
        }
      },
      {
        path: 'orders',
        name: 'shoporders',
        components: {
          center: ShopOrder,
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
