<template>
    <div class="containerMainBank">
        <h1>Banque</h1>

        <div class="nav">
            <p class="btn" style="background-color: #1b5299; color: white" @click="setSoldeBool">Solde</p>
            <p class="btn" style="background-color: #331832; color: white" @click="setVirementBool">Virement</p>
            <p class="btn" style="background-color: #694d75; color: white" @click="setHistoriqueBool">Historique</p>
        </div>

        <BanqueSolde v-if="soldeBool" :account-amount="accountAmount"/>

        <BanqueVirement v-if="virementBool"/>

        <BanqueTransactions v-if="historiqueBool" :account-transactions="accountTransactions"/>

        <button class="btn btn-danger" @click="logoutBankAccount">Logout</button>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import BanqueSolde from "@/components/banque/BanqueSolde.vue";
import BanqueVirement from "@/components/banque/BanqueVirement.vue";
import BanqueTransactions from "@/components/banque/BanqueTransactions.vue";

export default {
    name: "MainBank",
    components: {BanqueTransactions, BanqueVirement, BanqueSolde},
    data: () => ({
        soldeBool: true,
        virementBool: false,
        historiqueBool: false,
    }),
    props: {
        bankAccount: {
            type: Object,
            required: true,
        }
    },
    computed: {
        ...mapState('bank', ['accountAmount', 'accountTransactions']),
    },
    methods: {
        ...mapActions('bank', ['logoutBankAccount', 'getAccountAmount', "getAccountTransactions"]),
        setSoldeBool() {
            this.soldeBool = true;
            this.virementBool = false;
            this.historiqueBool = false;
        },
        setVirementBool() {
            this.soldeBool = false;
            this.virementBool = true;
            this.historiqueBool = false;
        },
        setHistoriqueBool() {
            this.soldeBool = false;
            this.virementBool = false;
            this.historiqueBool = true;
        },
    },
    created() {
        this.getAccountAmount(this.bankAccount.number);
        this.getAccountTransactions(this.bankAccount.number);
    }
};
</script>

<style scoped>
.containerMainBank {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.nav {
    display: flex;
    justify-content: space-around;
    width: 100%;
}
</style>
