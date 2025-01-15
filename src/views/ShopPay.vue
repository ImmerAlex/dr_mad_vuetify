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
                        :rules="[v => !!v || 'Le numéro de commande est requis']"
                        clearable
                        label="Numéro de commande"
                        outlined
                    ></v-text-field>

                    <div v-if="Object.keys(order).length === 0">
                        <p style="color: red;">Aucune commande trouvée pour cet UUID.</p>
                    </div>
                    <div v-else>
                        <p><strong>Commande trouvée :</strong></p>
                        <p>UUID : {{ order.uuid }}</p>
                        <p>Montant : {{ order.total }}€</p>
                        <p>Statut : {{ order.status }}</p>
                    </div>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :disabled="Object.keys(order).length === 0"
                            color="primary"
                            @click="handleOpenNavModal"
                        >
                            <v-icon left>mdi-cash-register</v-icon>
                            Payer
                        </v-btn>
                    </v-card-actions>
                </v-form>
            </v-card-text>
        </v-card>

        <ModalComponent v-if="!displayErrorModal" ref="modalComponent">
            <template v-slot:header>
                Confirmation de paiement
            </template>

            <template v-slot:content>
                <p>Commande : {{ order.uuid }}</p>
                <p>Montant : {{ order.total }}</p>

                <v-form class="d-flex flex-column gap-3 mb-3" @submit.prevent="confirmPayment">
                    <div>
                        <label class="form-label" for="transactionId">ID de transaction</label>
                        <input id="transactionId" v-model="transactionUuid" class="form-control" name="transactionId"
                               placeholder="Type here..." type="text"/>
                    </div>
                </v-form>

                <v-data-table
                    :headers="headers"
                    :items="accountTransactions"
                    :items-per-page="5"
                    class="elevation-1">

                    <template v-slot:item="{ item }">
                        <tr>
                            <td>{{ formatDate(item.date.$date) }}</td>
                            <td :class="item.amount > 0 ? 'bg-success text-white' : 'bg-danger text-white'">
                                {{ formatPrice(item.amount) }}
                            </td>
                            <td>
                                <v-btn
                                    color="primary"
                                    size="small"
                                    style="margin-right: 5px"
                                    variant="text"
                                    @click="setTransactionId(item.uuid)"
                                >
                                    <v-icon left size="small">mdi-cash-register</v-icon>
                                    Sélectionner
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </template>

            <template v-slot:actions>
                <v-btn
                    :disabled="!transactionUuid"
                    color="success"
                    @click="confirmPayment"
                >
                    Confirmer le paiement
                </v-btn>
            </template>
        </ModalComponent>

        <ModalComponent v-if="displayErrorModal" ref="modalComponent">
            <template v-slot:header>
                <p v-if="orderError.error === -1">Erreur</p>
                <p v-else>Succès</p>
            </template>

            <template v-slot:content>
                <p v-if="orderError.error === -1" class="alert alert-danger">{{ orderError.message }}</p>
                <p v-else class="alert alert-success">{{ orderError.message }}</p>
            </template>
        </ModalComponent>

    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import ModalComponent from "@/components/ModalComponent.vue";

export default {
    name: 'ShopPay',
    components: {ModalComponent},
    props: {
        orderId: {
            type: String,
            default: ''
        }
    },
    data: () => ({
        orderIdInput: '',
        transactionUuid: '',
        headers: [
            {text: 'Date', value: 'date'},
            {text: 'Montant', value: 'amount'},
            {text: 'Actions', value: 'actions', sortable: false},
        ],
        displayErrorModal: false,
    }),
    computed: {
        ...mapGetters('user', ['isLoggedUser', 'userOrders', 'orderError', 'loggedUser']),
        ...mapGetters('bank', ['accountTransactions']),

        order() {
            return this.userOrders?.find(order =>
                order.uuid === this.orderIdInput || order.uuid === this.orderId
            ) || {};
        }
    },
    methods: {
        handleOpenNavModal() {
            this.$refs.modalComponent.openNavModal();
        },
        setTransactionId(id) {
            this.transactionUuid = id;
        },
        formatDate(date) {
            return new Date(date).toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        formatPrice(price) {
            return Number(price).toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },
        async confirmPayment() {
            try {
                await this.$store.dispatch('user/makePayment', {
                    userId: this.loggedUser._id,
                    orderUuid: this.order.uuid,
                    transactionUuid: this.transactionUuid
                });

                this.displayErrorModal = true;

                setTimeout(() => {
                    this.displayErrorModal = false;

                    if (this.orderError.error === 0) {
                        this.$router.push({name: 'shoporders'});
                    }
                }, 2500);
            } catch (error) {
                console.error('Payment failed', error);
            }
        },
    },
    created() {
        if (!this.isLoggedUser) {
            this.$router.push({name: 'shoplogin'});
        }

        if (this.$route.params.orderId) {
            this.orderIdInput = this.$route.params.orderId;
        }
    },
}
</script>