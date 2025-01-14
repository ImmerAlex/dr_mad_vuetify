<template>
    <div>
<!--        {{ accountTransactions }}-->

        <div id="filtre" class="d-flex justify-content-center align-items-center gap-3">
            <div class="form-group">
                <label for="dateFrom">Debut</label>
                <input type="date" id="dateFrom" class="form-control" v-model="dateDebut">
            </div>
            <div class="form-group">
                <label for="dateTo">Fin</label>
                <input type="date" id="dateTo" class="form-control" v-model="dateFin">
            </div>
<!--            <button class="btn btn-primary mt-4" @click="filterTransactions">Filtrer</button>-->
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
                    <input type="checkbox" :id="transaction._id">
                </td>
                <td class="bg-success text-white" v-if="transaction.amount > 0">{{ transaction.amount }}</td>
                <td class="bg-danger text-white" v-else>{{ transaction.amount }}</td>
                <td>{{ formatDateHeure(transaction.date) }}</td>
                <td>
                    <button class="btn btn-primary">Details</button>
                </td>
            </tr>
            </tbody>
        </table>

    </div>
</template>

<script>
export default {
    name: "BanqueTransactions",
    props: {
        accountTransactions: {
            type: Array,
            required: true,
        },
    },
    data: () => ({
        dateDebut: '',
        dateFin: ''
    }),
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
            return this.accountTransactions.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                const startDate = this.dateDebut ? new Date(this.dateDebut) : new Date(-8640000000000000);
                const endDate = this.dateFin ? new Date(this.dateFin) : new Date(8640000000000000);
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        }
    },
};
</script>

<style scoped>
.table td,
.table th {
    vertical-align: middle;
    text-align: center;
}
</style>