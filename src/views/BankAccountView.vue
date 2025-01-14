<template>
    <div>
        <v-dialog v-model="showNavModal" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">
                    Navigation
                </v-card-title>

                <v-card-text class="d-flex flex-column gap-3">
                    <!--                        <v-form @submit.prevent="confirmPayment">-->
                    <!--                            <p class="mb-4">Commande : {{ filteredOrder?.uuid }}</p>-->
                    <!--                            <p class="mb-4">Montant : {{ filteredOrder?.total }}€</p>-->

                    <!--                            <v-text-field-->
                    <!--                                v-model="transactionId"-->
                    <!--                                label="ID de transaction"-->
                    <!--                                :rules="[v => !!v || 'L\'ID de transaction est requis']"-->
                    <!--                                outlined-->
                    <!--                                clearable-->
                    <!--                                :error-messages="transactionError"-->
                    <!--                            ></v-text-field>-->
                    <!--                        </v-form>-->

                    <v-btn color="primary" @click="closeNavModal">
                        <router-link :to="{name: 'bankSolde'}" class="link">solde</router-link>
                    </v-btn>

                    <v-btn color="success" @click="closeNavModal">
                        <router-link :to="{name: 'bankVirement'}" class="link">virement</router-link>
                    </v-btn>

                    <v-btn color="warning" @click="closeNavModal">
                        <router-link :to="{name: 'bankTransactions'}" class="link">historique</router-link>
                    </v-btn>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey darken-1"
                        text
                        @click="closeNavModal"
                    >
                        fermer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <div class="d-flex justify-space-between">
            <h3>Account</h3>

            <div id="burger" :class="showNavModal === true ? 'active' : ''" @click="openNavModal">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <router-view/>
    </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    name: "BankAccountView",
    data: () => ({
        showNavModal: false,
    }),
    methods: {
        ...mapGetters('bank', ['isLoggedBankAccount']),
        openNavModal() {
            this.showNavModal = true;
        },
        closeNavModal() {
            this.showNavModal = false;
        },
    },
    created() {
        if (!this.isLoggedBankAccount()) {
            this.$router.push({name: 'bankLogin'});
        }
    }
};
</script>

<style scoped>
#burger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 30px;
    position: relative;
    cursor: pointer;
}

#burger span {
    display: block;
    width: 100%;
    height: 3px;
    background: black;
    border-radius: 10px;
    transition: all 0.3s;
}

#burger span:nth-child(1) {
    transform-origin: 0 0;
}

#burger span:nth-child(3) {
    transform-origin: 0 100%;
}

#burger.active span:nth-child(1) {
    transform: rotate(45deg);
}

#burger.active span:nth-child(2) {
    opacity: 0;
}

#burger.active span:nth-child(3) {
    transform: rotate(-45deg);
}

.link {
    color: white;
    text-decoration: none;
}
</style>