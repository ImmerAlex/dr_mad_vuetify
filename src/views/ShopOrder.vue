<template>
  <v-container>
    <v-card class="mx-auto" >
      <v-card-title class="text-h5 d-flex align-center">
        <span>Mes commandes</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" :loading="loading" @click="refreshOrders" icon >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="error"
          type="error"
          text
          variant="tonal"
        >
          {{ error }}
        </v-alert>

        <div v-if="loading" class="d-flex justify-center my-4">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>

        <div v-else-if="!userOrders || !userOrders.length" class="text-center my-4">
          <v-icon size="48" color="grey">mdi-cart-off</v-icon>
          <div class="text-body-1 text-grey mt-2">
            Aucune commande trouvée
          </div>
        </div>

        <table v-else class="table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Date</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in userOrders" :key="order.uuid">
              <td>{{ order.uuid }}</td>
              <td>{{ formatDate(order.date.$date) }}</td>
              <td>
                <div v-for="item in order.items" :key="item._id">
                  {{ item.amount }}x {{ item.item.name }}
                </div>
              </td>
              <td>{{ formatPrice(order.total) }} €</td>
              <td>
                <v-chip
                  :color="getStatusColor(order.status)"
                  size="small"
                >
                  {{ getStatusLabel(order.status) }}
                </v-chip>
              </td>
              <td>
                <v-btn
                  v-if="order.status === 'pending'"
                  color="primary"
                  size="small"
                  variant="text"
                  style="margin-right: 5px"
                  :to="{ name: 'shoppay', params: { orderId: order.uuid }}"
                >
                  <v-icon left size="small">mdi-cash-register</v-icon>
                  Payer
                </v-btn>
                <v-btn
                  v-if="order.status === 'pending'"
                  color="secondary"
                  size="small"
                  variant="text"
                >
                  <v-icon left size="small">mdi-cash-register</v-icon>
                  Annuler
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ShopOrders',
  
  data() {
    return {
      orders: [],
      loading: true,
      error: null
    }
  },

  created() {
    if (!this.isLoggedUser) {
      this.$router.push({name: 'shoplogin'})
    }
    this.fetchOrders();
  },

  computed: {
    ...mapGetters('user', ['isLoggedUser']),
    ...mapGetters('user', ['loggedUser']),
    ...mapGetters('user', ['userOrders']),
  },


  methods: {
    fetchOrders() {
      // pour visualiser la jolie animation de chargement :)
      this.loading = true;
      setTimeout(() => {
        this.loading = false
      }, 500);
   },

    refreshOrders() {
      this.fetchOrders()
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    formatPrice(price) {
      return Number(price).toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    },

    getStatusColor(status) {
      const colors = {
        pending: 'warning',
        finalized: 'success',
        cancelled: 'error'
      }
      return colors[status] || 'grey'
    },

    getStatusLabel(status) {
      const labels = {
        pending: 'En attente',
        finalized: 'Finalisée',
        cancelled: 'Annulée'
      }
      return labels[status] || status
    }
  }
}
</script>
