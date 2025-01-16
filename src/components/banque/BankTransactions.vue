<template>
    <div>
        <ModalComponent ref="modalComponent" :persistent="true">
            <template v-slot:header>
                <h2 v-if="selectedTransactions.length < 1">Detail</h2>
                <h2 v-else>Details</h2>
            </template>

            <template v-slot:content>
                <div>
                    <div v-for="(transaction, index) in modalData" :key="index" class="d-flex align-center gap-2">
                        <p v-if="transaction.amount > 0" class="text-success">
                            {{ formatNumber(transaction.amount, 'fr-FR', 'EUR') }}</p>
                        <p v-else class="text-danger">{{ formatNumber(transaction.amount, 'fr-FR', 'EUR') }}</p>
                        <p>: {{ transaction.uuid }}</p>
                    </div>
                </div>
            </template>

            <template v-slot:actions>
                <v-btn class="grey darken-1" @click="handleCloseModal">Close</v-btn>
            </template>
        </ModalComponent>

        <div id="filtre" class="d-flex justify-content-center align-items-center gap-3">
            <div class="form-group">
                <label for="dateFrom">Debut</label>
                <input id="dateFrom" v-model="dateDebut" class="form-control" type="date">
            </div>
            <div class="form-group">
                <label for="dateTo">Fin</label>
                <input id="dateTo" v-model="dateFin" class="form-control" type="date">
            </div>
        </div>

        <v-data-table
            :headers="headers"
            :items="filterTransactions()"
            :items-per-page="5"
            class="elevation-1"
            no-data-text="Aucune transaction disponible">

            <template v-slot:item="{ item }">
                <tr>
                    <td>
                        <input :id="item._id" v-model="selectedTransactions" :value="item._id" type="checkbox">
                    </td>

                    <td v-if="item.amount >= 0" class="bg-success text-white">{{ item.amount }}</td>
                    <td v-else class="bg-danger text-white">{{ formatNumber(item.amount, 'fr-FR', 'EUR') }}</td>

                    <td>{{ formatDateHeure(item.date.$date) }}</td>

                    <td v-if="item.amount >= 0">D</td>
                    <td v-else>S</td>

                    <td>
                        <v-btn color="primary" @click="displayDetail(item._id)">Detail</v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <v-btn :disabled="selectedTransactions.length === 0" color="success" class="mt-2" @click="displayDetails">
            Details selected
        </v-btn>
    </div>
</template>

<script>
import {mapState} from "vuex";
import ModalComponent from "@/components/ModalComponent.vue";

export default {
    name: "BanqueTransactions",
    components: {ModalComponent},
    data: () => ({
        dateDebut: '',
        dateFin: '',
        modal: false,
        modalData: [],
        selectedTransactions: [],
        headers: [
            {text: 'Select', value: 'select', sortable: false},
            {text: 'Montant', value: 'amount'},
            {text: 'Date', value: 'date'},
            {text: 'S/D', value: 'sd'},
            {text: 'Action', value: 'action', sortable: false},
        ],
    }),
    computed: {
        ...mapState('bank', ['loggedBankAccount', "accountTransactions"]),
    },
    methods: {
        handleOpenNavModal() {
            this.$refs.modalComponent.openNavModal();
        },
        handleCloseModal() {
            this.modalData = [];
            this.$refs.modalComponent.closeNavModal();
        },
        formatDateHeure(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        },
        filterTransactions() {
            const startDate = this.dateDebut ? new Date(this.dateDebut) : new Date(-8640000000000000);
            const endDate = this.dateFin ? new Date(this.dateFin) : new Date(8640000000000000);

            return this.accountTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.date.$date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        },
        formatNumber(number, local, currency) {
            return new Intl.NumberFormat(local, {style: 'currency', currency: currency}).format(number);
        },
        displayDetail(id) {
            this.modalData.push(this.accountTransactions.find(transaction => transaction._id === id));
            this.handleOpenNavModal();
        },
        displayDetails() {
            this.modalData = this.accountTransactions.filter(transaction =>
                this.selectedTransactions.includes(transaction._id)
            );

            this.handleOpenNavModal()
        },
    },
};
</script>
