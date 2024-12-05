<template>
  <v-card>
    <v-app-bar
        color="primary"
        dark
    >
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Dr Mad</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        absolute
        height="fit-content"
        temporary
    >
      <v-list
          dense
          nav
      >
        <v-list-item-group
            v-model="group"
            active-class="primary--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>export default {
  name: "NavBar",
  data: () => ({
    drawer: false,
    group: null,
  }),
};
</script>
<style>

</style>