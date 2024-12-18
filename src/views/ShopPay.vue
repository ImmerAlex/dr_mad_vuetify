<template>
  <div class="shop-pay">
    <h2>Paiement de la commande</h2>
    <div class="payment-form">
      <div class="form-group">
        <label for="orderId">Numéro de commande</label>
        <input 
          type="text" 
          id="orderId" 
          v-model="orderIdInput"
          placeholder="Entrez l'ID de la commande"
          :disabled="!!orderId"
        >
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <button 
        @click="handlePayment" 
        class="pay-button"
        :disabled="!orderIdInput"
      >
        Payer
      </button>
    </div>
  </div>
</template>

<script>
import { payOrder } from '@/services/orders.service'

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
      error: null
    }
  },
  created() {
    if (this.orderId) {
      this.orderIdInput = this.orderId
    }
  },
  methods: {
    async handlePayment() {
      try {
        this.error = null
        const response = await payOrder(this.orderIdInput)
        if (response.error === 0) {
          this.$router.push({ name: 'shoporders' })
        } else {
          this.error = response.data
        }
      } catch (error) {
        this.error = 'Une erreur est survenue lors du paiement'
        console.error('Erreur lors du paiement:', error)
      }
    }
  },
  watch: {
    orderId(newValue) {
      this.orderIdInput = newValue
    }
  }
}
</script>

<style scoped>
.shop-pay {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.payment-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pay-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pay-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.pay-button:hover:not(:disabled) {
  background-color: #45a049;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}
</style>
