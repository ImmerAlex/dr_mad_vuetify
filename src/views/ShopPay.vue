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
            label="Numéro de commande"
            :disabled="!!orderId"
            :rules="[v => !!v || 'Le numéro de commande est requis']"
            outlined
            clearable
            :error-messages="error"
          ></v-text-field>

          <div v-if="filteredOrder">
            <p><strong>Commande trouvée :</strong></p>
            <p>UUID : {{ filteredOrder.uuid }}</p>
            <p>Montant : {{ filteredOrder.total }}€</p>
            <p>Statut : {{ filteredOrder.status }}</p>
          </div>
          <div v-else-if="orderIdInput">
            <p style="color: red;">Aucune commande trouvée pour cet UUID.</p>
          </div>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!filteredOrder"
              @click="handlePayment"
              :loading="loading"
            >
              <v-icon left>mdi-cash-register</v-icon>
              Payer
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>

      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        timeout="3000"
      >
        {{ snackbarText }}
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar = false"
          >
            Fermer
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
    loggedUser Id : {{ loggedUser._id }}
    {{ userOrders }}
  </v-container></template>

<script>
  import OrderService from '@/services/orders.service'
  import { mapGetters } from 'vuex'

  export default {
    name: 'ShopPay',
    props: {
      orderId: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        orderIdInput: '',
        error: null,
        loading: false,
        snackbar: false,
        snackbarText: '',
        snackbarColor: 'success'
      }
    },
    created() {
      if (this.$route.params.orderId) {
        this.orderIdInput = this.$route.params.orderId
      }
    },
    computed: {
      ...mapGetters('user', ['isLogged']),
      ...mapGetters('user', ['loggedUser']),
      ...mapGetters('user', ['userOrders']),
      filteredOrder() {
        if (!this.orderIdInput || !this.userOrders) return null
        return this.userOrders.find(order => order.uuid === this.orderIdInput)
      }
    },
    methods: {
      async handlePayment() {
        if (!this.filteredOrder) {
          this.error = 'Aucune commande valide trouvée pour cet UUID'
          this.snackbarColor = 'error'
          this.snackbarText = 'Aucune commande valide trouvée pour cet UUID'
          this.snackbar = true
          return
        }

  this.loading = true
  this.error = null

  try {
    const response = await OrderService.payOrder(this.filteredOrder.uuid)
    if (response.error === 0) {
      this.snackbarColor = 'success'
      this.snackbarText = 'Paiement effectué avec succès'
      this.snackbar = true

      // Attendre un peu pour que l'utilisateur puisse voir le message de succès
      setTimeout(() => {
        this.$router.push({ name: 'shoporders' })
      }, 1000)
    } else {
      this.error = response.data
      this.snackbarColor = 'error'
      this.snackbarText = response.data
      this.snackbar = true
    }
  } catch (error) {
    this.error = 'Une erreur est survenue lors du paiement'
    this.snackbarColor = 'error'
    this.snackbarText = 'Une erreur est survenue lors du paiement'
    this.snackbar = true
    console.error('Erreur lors du paiement:', error)
  } finally {
    this.loading = false
  }
}
    },
  }
</script>
