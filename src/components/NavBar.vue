<template>
  <v-card>
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Dr Mad</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute height="fit-content" temporary>
      <v-list dense nav>
        <v-list-item-group active-class="primary--text text--accent-4">

          <template v-for="link in links">
            <router-link v-if="link.to" :key="link.title" :to="link.to" class="d-flex align-center"
                         tag="v-list-item">
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </router-link>

            <v-list-item v-else :key="link.title" class="d-flex align-center" @click="handleAction(link.action)">
              <v-list-item-icon>
                <v-icon>{{ link.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </v-list-item>

          </template>

        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "NavBar",
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapGetters('user', ['isLogged']),
    links() {
      const links = [];

      if (!this.isLogged) {

        links.push({title: "Login", icon: "mdi-login", to: {'name': 'shoplogin'}});
        links.push({title: "Register", icon: "mdi-account-plus", to: {'name': 'register'}});

      } else {

        links.push({title: "Home", icon: "mdi-home", to: {'name': 'home'}});
        links.push({title: "Profile", icon: "mdi-account", to: {'name': 'profile'}});
        links.push({title: "Logout", icon: "mdi-logout", action: 'logout'});

      }

      return links;
    },
  },
  methods: {
    ...mapActions('user', ['logout']),
    handleAction(action) {
      console.log(action)
      this[action]();
    }
  }
};
</script>