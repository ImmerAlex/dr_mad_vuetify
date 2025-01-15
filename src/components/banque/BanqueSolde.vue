<template>
    <div class="d-flex flex-column align-center gap-2">
        <h1>Solde du compte</h1>
        <h3 class="alert alert-success" v-if="accountAmount > 0">
            {{ formatNumber(accountAmount , 'fr-FR', 'EUR') }}</h3>
        <h3 class="alert alert-danger" v-else>{{ formatNumber(accountAmount, 'fr-FR', 'EUR') }}</h3>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "BanqueSolde",
    computed: {
        ...mapState('bank', ['accountAmount'])
    },
    methods: {
        formatNumber(number, local, currency) {
            return new Intl.NumberFormat(local, {style: 'currency', currency: currency}).format(number);
        }
    }
};
</script>
