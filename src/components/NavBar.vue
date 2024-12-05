<template>
  <v-card>
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Dr Mad</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute height="fit-content" temporary>
      <v-list dense nav>
        <v-list-item-group active-class="primary--text text--accent-4">
          <router-link v-for="link in links" :key="link.title" :to="link.to" tag="v-list-item" class="d-flex align-center">
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </router-link>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    drawer: false,
    links: [
      { title: "Home", icon: "mdi-home", to: { name: "home" } },
      { title: "About", icon: "mdi-bank", to: { name: "about" } },
    ]
  }),
};
</script>

<style>
</style>