<template>
    <div>
        <p>Bank number: {{ bankAccount.number }}</p>
        <p>Bank amount: {{ bankAccount.amount }}</p>
        <button @click="logoutBankAccount" class="btn btn-danger">Logout</button>
    </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "MainBank",
    props: {
        bankAccount: {
            type: Object,
            required: true,
        }
    },
    methods: {
        ...mapActions('bank', ['logoutBankAccount']),
    }
};
</script>
