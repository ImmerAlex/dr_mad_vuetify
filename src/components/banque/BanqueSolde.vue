<template>
    <div class="d-flex flex-column align-center gap-2">
        <h1>Solde du compte</h1>
        <h3 class="alert alert-success" v-if="loggedBankAccount.amount > 0">
            {{ formatNumber(loggedBankAccount.amount, 'fr-FR', 'EUR') }}</h3>
        <h3 class="alert alert-danger" v-else>{{ formatNumber(loggedBankAccount.amount, 'fr-FR', 'EUR') }}</h3>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "BanqueSolde",
    computed: {
        ...mapState('bank', ['loggedBankAccount'])
    },
    methods: {
        formatNumber(number, local, currency) {
            return new Intl.NumberFormat(local, {style: 'currency', currency: currency}).format(number);
        }
    }
};
</script>
