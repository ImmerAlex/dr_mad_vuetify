import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from "@/views/HomeView.vue";
import VirusesView from '@/views/VirusesView.vue'
import BankAccountView from '@/views/BankAccountView.vue'
import BankView from '@/views/BankView.vue'
import ShopView from '@/views/ShopView.vue'
import ShopLoginView from '@/views/ShopLoginView.vue'
import ShopPay from '@/views/ShopPay.vue'
import ShopBuy from '@/views/ShopBuy.vue';
import ShopOrder from '@/views/ShopOrder.vue';
import BankLogin from "@/components/banque/BankLogin.vue";
import BanqueHome from "@/components/banque/BankHome.vue";
import BanqueSolde from "@/components/banque/BankSolde.vue";
import BanqueTransactions from "@/components/banque/BankTransactions.vue";
import BanqueVirement from "@/components/banque/BankVirement.vue";

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
                },
            },
        ]
    },
    {
        path: '/shop/items',
        name: 'shopitems',
        component: VirusesView
    },
    {
        path: '/bank',
        name: 'bank',
        component: BankView,
        children: [
            {
                path: 'home',
                name: 'bankHome',
                component: BanqueHome,
            },
            {
                path: 'login',
                name: 'bankLogin',
                component: BankLogin,
            },
            {
                path: 'account',
                name: 'bankAccount',
                component: BankAccountView,
                children: [
                    {
                        path: 'solde',
                        name: 'bankSolde',
                        component: BanqueSolde,
                    },
                    {
                        path: 'transactions',
                        name: 'bankTransactions',
                        component: BanqueTransactions,
                    },
                    {
                        path: 'virements',
                        name: 'bankVirement',
                        component: BanqueVirement,
                    }
                ]
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
