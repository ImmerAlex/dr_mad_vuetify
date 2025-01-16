<template>
    <div class="d-flex flex-column gap-3">
        <h3 class="bg-primary" style="color: white; padding: 10px; border-radius: 10px 10px 0 0;">Panier</h3>

        <table class="table table-striped">
            <thead>
            <tr>
                <th>name</th>
                <th>price</th>
                <th>quantity</th>
                <th>action</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(item, index) in cart" :key="index" class="item-row-cart">
                <td style="display: none;">{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>
                    <v-btn color="error" @click="$emit('removeCartItem', index)">Remove</v-btn>
                </td>
            </tr>
            </tbody>
        </table>

        <v-btn :disabled="cart.length === 0" color="error" @click="$emit('suppressCart')">Vider le panier</v-btn>

        <div class="d-flex align-items-center justify-content-between bg-secondary"
             style="color: white; padding: 10px 10px 0 10px; border-radius: 0 0 10px 10px">
            <h4>Total</h4>
            <h4>{{ total }}</h4>
        </div>

        <v-btn :disabled="cart.length === 0" color="success" @click="goToPay">Payer</v-btn>
    </div>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
import {mapActions, mapState} from "vuex";

export default {
    name: "BasketList",
    props: {
        cart: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapState('user', ['loggedUser', 'userOrders']),
        ...mapState('shop', ['viruses']),
        total() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        }
    },
    methods: {
        ...mapActions('user', ['fetchOrders', 'addOrder']),
        async goToPay() {
            console.log('goToPay');
            const uuid = uuidv4();

            await this.fetchOrders(this.loggedUser._id);

            const virusesOrder = this.cart.map(item => {
                const virus = this.viruses.find(virus => virus._id === item.id);
                return {
                    item: virus,
                    amount: item.quantity,
                    _id: uuidv4(),
                }
            });

            await this.addOrder({
                date: {
                    $date: new Date().toISOString(),
                },
                items: virusesOrder,
                status: 'pending',
                total: this.total,
                uuid: uuid,
                _id: uuidv4(),
            })
                .then(() => {
                    this.$router.push({name: 'shoppay', params: {orderId: uuid}});
                })
        },
    }
}
</script>