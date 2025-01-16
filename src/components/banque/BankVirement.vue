<template>
    <div class="d-flex flex-column gap-3 container">
        <h3>Debit / virement</h3>

        <div class="d-flex flex-column gap-2">
            <div>
                <label class="form-label" for="amount">Montant</label>
                <input id="amount" 
                v-model="amount" 
                class="form-control" 
                name="amount" 
                placeholder="Montant"
                type="number"
                min="0"/>
            </div>

            <div class="form-check">
                <input id="addDestAccount" 
                v-model="addDestAccount" 
                class="form-check-input" 
                type="checkbox"/>
                <label class="form-check-label" for="addDestAccount">Ajouter un compte destinataire</label>
            </div>

            <div v-if="addDestAccount">
                <label class="form-label" for="destAccount">Compte destinataire</label>
                <input id="destAccount" 
                v-model="destAccount" 
                class="form-control" 
                name="destAccount"
                placeholder="Compte destinataire" 
                type="text"/>
            </div>

            <v-btn color="primary" 
                @click="transfer" 
                :disabled="!isValidForm">Virement</v-btn>
        </div>

        <!-- Message d'erreur -->
        <div v-if="displayError">
            <p v-if="accountError.error === 0" class="alert alert-success">
                {{ accountError.message }}
            </p>

            <p v-else class="alert alert-danger">
                {{ accountError.message }}
            </p>

        </div>

    </div>
</template>

<script>
    import { mapActions, mapState } from "vuex";

    export default {
        name: "BanqueVirement",
        data: () => ({
            amount: "",
            addDestAccount: false,
            destAccount: "",
            displayError: false,
        }),
        computed: {
            ...mapState('bank', ['loggedBankAccount', 'accountError']),
            isValidForm() {
                const amountValid = parseFloat(this.amount) > 0;
                if (this.addDestAccount) {
                    return amountValid && this.destAccount.trim() !== "";
                }
                return amountValid;
            }
        },
        methods: {
            ...mapActions('bank', ['createWithdraw', 'createPayment']),
            async transfer() {
                if (this.addDestAccount) {
                    // Cas du virement
                    await this.createPayment({
                        idAccount: this.loggedBankAccount._id,
                        destNumber: this.destAccount,
                        amount: parseFloat(this.amount)
                    }).then(() => {
                        this.displayError=true;
                        setTimeout(()=>{
                            this.displayError=false;
                        },5000);
                    });
                } else {
                    // Cas du retrait simple
                    await this.createWithdraw({
                        idAccount: this.loggedBankAccount._id,
                        amount: parseFloat(this.amount)
                    }).then(() => {
                        this.displayError=true;
                        setTimeout(()=>{
                            this.displayError=false;
                        },5000);
                    });
                }
            }
        }
    };
</script>
