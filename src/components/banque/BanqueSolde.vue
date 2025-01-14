<template>
 <div class="d-flex flex-column align-center gap-2">
    <h1>Solde du compte</h1>
    <h3 class="alert alert-success" v-if="accountAmount > 0">{{ accountAmount }} €</h3>
    <h3 class="alert alert-danger" v-else>{{ accountAmount }} €</h3>
 </div>
</template>

<script>
export default {
    name: "BanqueSolde",
    props: {
        accountAmount: {
            type: Number,
            required: true,
        },
    },
};
</script>
