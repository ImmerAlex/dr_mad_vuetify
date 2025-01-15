<template>
    <v-container>
        <v-card class="mx-auto" max-width="600">
            <v-card-title class="text-h5">
                Paiement de la commande
            </v-card-title>

            <v-card-text>
                <v-form @submit.prevent="handlePayment">
                    <v-text-field
                        v-model="orderIdInput"
                        :disabled="!!orderId"
                        :error-messages="error"
                        :rules="[v => !!v || 'Le numéro de commande est requis']"
                        clearable
                        label="Numéro de commande"
                        outlined
                    ></v-text-field>

                    <div v-if="filteredOrder">
                        <p><strong>Commande trouvée :</strong></p>
                        <p>UUID : {{ filteredOrder.uuid }}</p>
                        <p>Montant : {{ filteredOrder.total }}€</p>
                        <p>Statut : {{ filteredOrder.status }}</p>
                    </div>
                    <div v-else-if="orderIdInput">
                        <p style="color: red;">Aucune commande trouvée pour cet UUID.</p>
                    </div>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :disabled="!filteredOrder"
                            :loading="loading"
                            color="primary"
                            @click="handlePayment"
                        >
                            <v-icon left>mdi-cash-register</v-icon>
                            Payer
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card-text>

            <v-dialog v-model="showPaymentModal" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">
                        Confirmation de paiement
                    </v-card-title>

                    <v-card-text>
                        <v-form @submit.prevent="confirmPayment">
                            <p class="mb-4">Commande : {{ filteredOrder?.uuid }}</p>
                            <p class="mb-4">Montant : {{ filteredOrder?.total }}€</p>

                            <v-text-field
                                v-model="transactionId"
                                :error-messages="transactionError"
                                :rules="[v => !!v || 'L\'ID de transaction est requis']"
                                clearable
                                label="ID de transaction"
                                outlined
                            ></v-text-field>
                        </v-form>
                        <table class="table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="transaction in accountTransactions" :key="transaction.uuid">
                                <td>{{ formatDate(transaction.date) }}</td>
                                <td>{{ formatPrice(transaction.amount) }} €</td>
                                <td>
                                    <v-btn
                                        color="primary"
                                        size="small"
                                        style="margin-right: 5px"
                                        variant="text"
                                        @click="setTransactionId(transaction.uuid)"
                                    >
                                        <v-icon left size="small">mdi-cash-register</v-icon>
                                        Sélectionner
                                    </v-btn>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="grey darken-1"
                            text
                            @click="closePaymentModal"
                        >
                            Annuler
                        </v-btn>
                        <v-btn
                            :disabled="!transactionId"
                            :loading="loading"
                            color="primary"
                            @click="confirmPayment"
                        >
                            Confirmer le paiement
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

<!--            <v-snackbar-->
<!--                v-model="snackbar"-->
<!--                :color="snackbarColor"-->
<!--                timeout="3000"-->
<!--            >-->
<!--                {{ snackbarText }}-->
<!--                <template v-slot:action="{ attrs }">-->
<!--                    <v-btn-->
<!--                        text-->
<!--                        v-bind="attrs"-->
<!--                        @click="snackbar = false"-->
<!--                    >-->
<!--                        Fermer-->
<!--                    </v-btn>-->
<!--                </template>-->
<!--            </v-snackbar>-->
        </v-card>
    </v-container>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'

export default {
    name: 'ShopPay',
    props: {
        orderId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            orderIdInput: '',
            error: null,
            loading: false,
            showPaymentModal: false,
            transactionId: '',
            transactionError: null
        }
    },
    created() {
        if (!this.isLoggedUser) {
            this.$router.push({name: 'shoplogin'})
        }

        if (this.$route.params.orderId) {
            this.orderIdInput = this.$route.params.orderId
        }
    },
    computed: {
        ...mapState('user', ['orderError']),
        ...mapGetters('user', ['isLoggedUser', 'loggedUser', 'userOrders']),
        ...mapGetters('bank', ['loggedBankAccount', 'accountTransactions']),

        filteredOrder() {
            if (!this.orderIdInput || !this.userOrders) return null
            return this.userOrders.find(order =>
                order.uuid === this.orderIdInput &&
                order.status === 'pending'
            )
        }
    },
    methods: {
        ...mapActions('user', ['makePayment']),
        setTransactionId(id) {
            this.transactionId = id;
        },
        handlePayment() {
            if (!this.filteredOrder) {
                this.error = 'Aucune commande valide trouvée pour cet UUID'
                return
            }

            this.showPaymentModal = true
        },

        closePaymentModal() {
            this.showPaymentModal = false
            this.transactionId = ''
            this.transactionError = null
        },

        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        },

        formatPrice(price) {
            return Number(price).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        },

        async confirmPayment() {
            if (!this.transactionId) {
                this.transactionError = 'L\'ID de transaction est requis'
                return
            }
            await this.makePayment({
                userId: this.loggedUser._id,
                orderUUID: this.filteredOrder.uuid,
                transId: this.transactionId,
                accountNumber: this.accountNumber,
            })

            this.loading = true
            if (this.orderError.error === -1) {
                console.log(this.orderError.data)
            }

            // this.transactionError = null


            // if (response.error === 0) {
            //    this.snackbarColor = 'success'
            //    this.snackbarText = 'Paiement effectué avec succès'
            //    this.snackbar = true
            //    this.closePaymentModal()

            //    setTimeout(() => {
            //      this.$router.push({ name: 'shoporders' })
            //    }, 1000)
            //  } else {
            //    this.transactionError = response.data
            //    this.snackbarColor = 'error'
            //    this.snackbarText = response.data
            //    this.snackbar = true
            //  }
            //} catch (error) {
            //  this.transactionError = 'Une erreur est survenue lors du paiement'
            //  this.snackbarColor = 'error'
            //  this.snackbarText = 'Une erreur est survenue lors du paiement'
            //  this.snackbar = true
            //  console.error('Erreur lors du paiement:', error)
            //} finally {
            //  this.loading = false
            // }
        },
    }
}
</script>
