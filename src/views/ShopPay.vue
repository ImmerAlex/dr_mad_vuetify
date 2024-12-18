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

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!orderIdInput"
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
  </v-container>
</template>

<script>
  import OrderService from '@/services/orders.service'

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
      if (this.orderId) {
        this.orderIdInput = this.orderId
      }
    },
    methods: {
      async handlePayment() {
        if (!this.orderIdInput) return

        this.loading = true
        this.error = null

        try {
          const response = await OrderService.payOrder(this.orderIdInput)
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
