<template>
  <v-app>
    <NavBar/>

    <v-main class="container mt-3">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

import NavBar from "@/components/NavBar.vue";

export default {
  name: 'App',
  components: {NavBar},

  data: () => ({
    //
  }),
};
</script>
