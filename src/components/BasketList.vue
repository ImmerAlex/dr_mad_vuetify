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

        <div v-if="total!=subtotal" class="d-flex align-items-center justify-content-between bg-secondary"
             style="color: white; padding: 10px 10px 0 10px">
            <h4>Total sans promotions</h4>
            <h4>{{ subtotal }}</h4>
        </div>

        <div class="d-flex align-items-center justify-content-between bg-primary"
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
    subtotal(){
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    total() {
      return this.cart.reduce((acc, item) => {
        // Trouver le virus correspondant dans la liste des virus
        const virus = this.viruses.find(v => v._id === item.id);
        if (!virus) return acc + (item.price * item.quantity);

        let price = virus.price;
        let discount = 0;

        // Si le virus a des promotions, trouver la meilleure promotion applicable
        if (virus.promotion && virus.promotion.length > 0) {
            // Trier les promotions par montant décroissant pour avoir la meilleure remise possible
            const applicablePromotions = virus.promotion
                .filter(promo => item.quantity >= promo.amount)
                .sort((a, b) => b.discount - a.discount);

            if (applicablePromotions.length > 0) {
                // Prendre la meilleure promotion (première après le tri)
                discount = applicablePromotions[0].discount;
            }
        }

        // Calculer le prix avec la remise
        const discountedPrice = price * (1 - discount / 100);
        return acc + (discountedPrice * item.quantity);
    }, 0);
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
