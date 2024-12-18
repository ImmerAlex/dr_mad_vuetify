<template>
  <v-container>
    <v-card class="mx-auto" max-width="900">
      <v-card-title class="text-h5 d-flex align-center">
        <span>Mes commandes</span>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :loading="loading"
          @click="refreshOrders"
          icon
        >
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

        <div v-else-if="!orders.length" class="text-center my-4">
          <v-icon size="48" color="grey">mdi-cart-off</v-icon>
          <div class="text-body-1 text-grey mt-2">
            Aucune commande trouvée
          </div>
        </div>

        <v-table v-else>
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
            <tr v-for="order in orders" :key="order.uuid">
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
                  :to="{ name: 'shoppay', params: { orderId: order.uuid }}"
                >
                  <v-icon left size="small">mdi-cash-register</v-icon>
                  Payer
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import OrderService from '@/services/orders.service'

export default {
  name: 'ShopOrders',
  
  data() {
    return {
      orders: [],
      loading: false,
      error: null
    }
  },

  created() {
    this.fetchOrders()
  },

  methods: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        // TODO: Récupérer l'ID de l'utilisateur connecté depuis le store
        const userId = "66d58122c08b4d64db14cd04" 
        const response = await OrderService.getUserOrders(userId)
        
        if (response.error) {
          this.error = response.data
        } else {
          this.orders = response.data
        }
      } catch (err) {
        this.error = "Impossible de récupérer vos commandes"
        console.error('Erreur lors de la récupération des commandes:', err)
      } finally {
        this.loading = false
      }
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
