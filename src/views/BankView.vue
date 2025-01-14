<template>
    <!--    <div v-if="loggedBankAccount !== undefined">-->
    <!--        <MainBank :bank-account="loggedBankAccount"/>-->
    <!--    </div>-->

    <!--    <div v-else>-->
    <!--        <BankLogin/>-->
    <!--    </div>-->
    <div class="container">
        <h1 class="mb-4">Banque</h1>

        <RouterView/>
    </div>
</template>

<script>
import {mapState} from "vuex";
// import BankLogin from "@/components/banque/BankLogin.vue";
// import MainBank from "@/components/banque/BanqueHome.vue";

export default {
    name: "BankAccountView",
    // components: {MainBank, BankLogin},
    data: () => ({
        number: "",
    }),
    computed: {
        ...mapState('bank', ['loggedBankAccount'])
    },
};
</script>
