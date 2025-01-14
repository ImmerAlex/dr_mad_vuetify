<template>
    <div v-if="loggedBankAccount !== undefined">
        <MainBank :bank-account="loggedBankAccount"/>
    </div>

    <div v-else>
        <BankLogin/>
    </div>
</template>

<script>
import {mapState} from "vuex";
import BankLogin from "@/components/banque/BankLogin.vue";
import MainBank from "@/components/banque/MainBank.vue";

export default {
    name: "BankAccountView",
    components: {MainBank, BankLogin},
    data: () => ({
        number: "",
    }),
    computed: {
        ...mapState('bank', ['loggedBankAccount'])
    },
};
</script>
