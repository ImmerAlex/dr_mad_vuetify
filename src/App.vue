<template>
    <v-app>
        <NavBar :links="links">
            <template v-slot:link="{link}">
                <v-list-item-icon v-if="link.icon">
                    <v-icon :class="link.title === 'Logout' ? 'text-danger' : ''">{{ link.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title v-if="link.title" :class="link.title === 'Logout' ? 'text-danger' : ''">
                    {{link.title}}
                </v-list-item-title>
            </template>
        </NavBar>

        <v-main class="container mt-3">
            <router-view/>
        </v-main>
    </v-app>
</template>

<script>

import NavBar from "@/components/NavBar.vue";
import {mapGetters} from "vuex";

export default {
    name: 'App',
    components: {NavBar},
    computed: {
        ...mapGetters('user', ['isLoggedUser']),
        ...mapGetters('bank', ['isLoggedBankAccount']),
        links() {
            const links = [];

            if (!this.isLoggedUser) {
                if (!this.isLoggedBankAccount) {
                    links.push({title: null, icon: "mdi-bank", to: {name: 'bankLogin'}});
                } else {
                    links.push({title: null, icon: "mdi-bank", to: {name: 'bankSolde'}});
                }

                links.push({title: "Login", icon: "mdi-login", to: {name: 'shoplogin'}});
            } else {
                if (!this.isLoggedBankAccount) {
                    links.push({title: null, icon: "mdi-bank", to: {name: 'bankLogin'}});
                } else {
                    links.push({title: null, icon: "mdi-bank", to: {name: 'bankSolde'}});
                }

                links.push({title: "Home", icon: "mdi-home", to: {name: 'home'}});
                links.push({title: "Shop", icon: "mdi-account", to: {name: 'shophome'}});
                links.push({title: "Buy", icon: "mdi-account", to: {name: 'shopbuy'}});
                links.push({title: "Pay", icon: "mdi-account", to: {name: 'shoppay'}});
                links.push({title: "Order", icon: "mdi-account", to: {name: 'shoporders'}});
                links.push({title: "Viruses", icon: "mdi-virus", to: {name: 'shopitems'}});
                links.push({title: "Logout", icon: "mdi-logout", action: 'logout'});
            }

            return links;
        },
    },
};
</script>
