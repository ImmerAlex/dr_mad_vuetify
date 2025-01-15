<template>
    <div>
        <!--        {{ accountTransactions }}-->

        <div v-if="modal" id="modal" @click="hideModal">
            <div id="modal-content">
                <h2 class="mb-4">Detail(s)</h2>

                <div v-for="(transaction, index) in modalData" :key="index" class="d-flex align-center gap-2">
                    <p v-if="transaction.amount > 0" class="text-success">
                        {{ formatNumber(transaction.amount, 'fr-FR', 'EUR') }}</p>
                    <p v-else class="text-danger">{{ formatNumber(transaction.amount, 'fr-FR', 'EUR') }}</p>
                    <p>: {{ transaction.uuid }}</p>
                </div>
            </div>
        </div>

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

        <table class="table table-striped">
            <thead>
            <tr>
                <th>select</th>
                <th>montant</th>
                <th>date</th>
                <th>action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(transaction, index) in filterTransactions()" :key="index">
                <td>
                    <input :id="transaction._id" type="checkbox" v-model="selectedTransactions"
                           :value="transaction._id">
                </td>

                <td v-if="transaction.amount > 0" class="bg-success text-white">{{ transaction.amount }}</td>
                <td v-else class="bg-danger text-white">{{ formatNumber(transaction.amount, 'fr-FR', 'EUR') }}</td>

                <td>{{ formatDateHeure(transaction.date) }}</td>
                <td>
                    <button class="btn btn-primary" @click="displayDetail(transaction._id)">Detail</button>
                </td>
            </tr>
            </tbody>
        </table>

        <button class="btn btn-success" @click="displayDetails">Details selected</button>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "BanqueTransactions",
    data: () => ({
        dateDebut: '',
        dateFin: '',
        modal: false,
        modalData: [],
        selectedTransactions: []
    }),
    computed: {
        ...mapState('bank', ['loggedBankAccount', "accountTransactions"]),
    },
    methods: {
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
                const transactionDate = new Date(transaction.date);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        },
        formatNumber(number, local, currency) {
            return new Intl.NumberFormat(local, {style: 'currency', currency: currency}).format(number);
        },
        displayDetail(id) {
            this.modalData.push(this.accountTransactions.find(transaction => transaction._id === id));
            this.modal = true;
        },
        displayDetails() {
            this.modalData = this.accountTransactions.filter(transaction =>
                this.selectedTransactions.includes(transaction._id)
            );
            this.modal = true;
        },
        hideModal() {
            this.modal = false;
            this.modalData = [];
        },
    },
};
</script>

<style scoped>
.table td,
.table th {
    vertical-align: middle;
    text-align: center;
}

#modal {
    display: grid;
    place-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

#modal-content {
    position: relative;
    padding: 15px 30px 5px 30px;
    border-radius: 5px;
    background-color: white;
}

</style>
