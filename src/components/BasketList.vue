<template>
    <div class="d-flex flex-column gap-3">
        <h3 class="bg-primary" style="color: white; padding: 10px; border-radius: 10px 10px 0 0;">Panier</h3>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th>name</th>
                    <th>price</th>
                    <th>quantity</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(item, index) in cart" :key="index" class="item-row-cart">
                    <td style="display: none;">{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.price}}</td>
                    <td>{{item.quantity}}</td>
                </tr>
            </tbody>
        </table>

        <div class="d-flex align-items-center justify-content-between bg-secondary" style="color: white; padding: 10px 10px 0 10px; border-radius: 0 0 10px 10px">
            <h4>Total</h4>
            <h4>{{ total }}</h4>
        </div>

        <form @submit.prevent="goToPay" class="btn btn-danger">
            <button type="submit">Payer</button>
        </form>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

export default {
    name: "BasketList",
    props: {
        cart: {
            type: Array,
            required: true
        }
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    },
    methods: {
        goToPay() {
            const uuid = uuidv4();

            this.$router.push({ name: 'shoppay', params: { orderId: uuid } });
        },
    }
}
</script>