<template>
    <div class="d-flex flex-column gap-3 container">
        <h3>Debit / virement</h3>

        <div class="d-flex flex-column gap-2">
            <div>
                <label class="form-label" for="amount">Montant</label>
                <input id="amount" v-model="amount" class="form-control" name="amount" placeholder="Montant"
                       type="text"/>
            </div>

            <div class="form-check">
                <input id="addDestAccount" v-model="addDestAccount" class="form-check-input" type="checkbox"/>
                <label class="form-check-label" for="addDestAccount">Ajouter un compte destinataire</label>
            </div>

            <div v-if="addDestAccount">
                <label class="form-label" for="destAccount">Compte destinataire</label>
                <input id="destAccount" v-model="destAccount" class="form-control" name="destAccount"
                       placeholder="Compte destinataire" type="text"/>
            </div>

            <v-btn color="primary" @click="transfer">Virement</v-btn>
        </div>
    </div>
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "BanqueVirement",
    data: () => ({
        amount: "0",
        addDestAccount: false,
        destAccount: "",
    }),
    methods: {
        ...mapActions('bank', ['createVirement']),
    }
};
</script>