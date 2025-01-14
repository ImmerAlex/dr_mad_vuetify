<template>
    <div class="d-flex flex-column-reverse flex-lg-row gap-4 container">
        <div class="containerLogin">
            <h1>Bank Login</h1>

            <p v-if="accountError" class="alert alert-danger">{{ accountError }}</p>

            <div class="mb-3">
                <label class="form-label" for="login">Account number</label>
                <input id="login" v-model="number" class="form-control" list="listSuggest" type="text" @input="isAccountNumberValid">
                <datalist id="listSuggest">
                    <option value="FRDRMAD578901234567890-0000666">FRDRMAD578901234567890-0000666</option>
                    <option value="FRSHOP4578901234567890-0000999">FRSHOP4578901234567890-0000999</option>
                </datalist>
            </div>

            <button :disabled="!validAccountNumber" class="btn btn-primary" @click="loginToBankAccount(number)">
                Login
            </button>
        </div>
        <div class="containerHistorique">
            <h1>Historique de connexion</h1>
            <ul>
                <li v-for="(number, index) in historiqueLoggedBankAccount" :key="index"
                    @click="setAccountNumber(number); isAccountNumberValid()">
                    {{ number }}
                </li>
            </ul>
            <p v-if="historiqueLoggedBankAccount.length === 0">Aucun historique</p>
        </div>
    </div>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";

export default {
    name: "BankLogin",
    data: () => ({
        number: "",
        validAccountNumber: false,
    }),
    computed: {
        ...mapState('bank', ['accountError']),
        ...mapGetters('bank', ['historiqueLoggedBankAccount']),
    },
    methods: {
        ...mapActions('bank', ['loginToBankAccount']),
        isAccountNumberValid() {
            const rexp = RegExp("^[A-Za-z0-9]{22}-[0-9]{7}$", "g");
            this.validAccountNumber = rexp.test(this.number);
        },
        setAccountNumber(number) {
            this.number = number;
        },
    }
};
</script>

<style scoped>
.containerLogin {
    width: 60%;
}

.containerHistorique {
    width: 40%;
}

@media (max-width: 768px) {
    .containerLogin {
        width: 100%;
    }

    .containerHistorique {
        width: 100%;
    }
}
</style>