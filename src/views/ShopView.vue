<template>
    <div>
        <h1>Boutique</h1>
        <router-view name="center"/>
    </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
    name: "ShopView",
    computed: {
        ...mapGetters('user', ['isLoggedUser'])
    },
    created() {
        if (!this.isLoggedUser && this.$router.currentRoute.name !== 'shoplogin') {
            this.$router.push({name: 'shoplogin'})
        }
    }
}
</script>

