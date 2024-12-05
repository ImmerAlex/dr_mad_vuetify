import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '../views/HomeView.vue'
import ShopView from '@/views/ShopView.vue'
import CardExemple from '@/components/CardExemple'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/shop',
    name: 'shopmain',
    component: ShopView,
    children: [
      {
       path: 'home',
        name: 'shophome',
        components:{
            center: CardExemple,
        }
      },
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
