<template>
  <div class="checkout mt-5">
    <div class="checkout__form">
      <b-row>

        <b-col cols="6">
          <p>First Name</p>
          <b-input v-model="customerInfo.name" />
        </b-col>
        <b-col cols="6">
          <p>Last Name</p>
          <b-input v-model="customerInfo.lastName" />
        </b-col>

        <b-col cols="6">
          <p>Street Address</p>
          <b-input v-model="customerInfo.streetAddress" />
        </b-col>
        <b-col cols="6">
          <p>House Number</p>
          <b-input v-model="customerInfo.houseNumber" />
        </b-col>

        <b-col cols="6">
          <p>Postal Code</p>
          <b-input v-model="customerInfo.postalCode" />
        </b-col>
        <b-col cols="6">
          <p>Country</p>
          <b-input v-model="customerInfo.country" />
        </b-col>

        <b-col cols="6">
          <p>Email</p>
          <b-input v-model="customerInfo.email" />
        </b-col>
        <b-col cols="6">
          <p>Phone Number</p>
          <b-input v-model="customerInfo.phoneNumber" />
        </b-col>

      </b-row>
    </div>

    <b-row class="justify-content-end" v-if="products.length">
      <b-col cols="5">
        <div class="d-flex justify-content-between mb-4">
          <p><strong>Subtotal:</strong></p>
          <p><strong>{{ subTotal }}</strong></p>
        </div>

        <div class="d-flex justify-content-between mb-4" v-if="!customerInfo.country.length || !isInternational">
          <p><strong>Shipping:</strong></p>
          <p><strong>{{ shipping }}</strong></p>
        </div>

        <div class="d-flex justify-content-between mb-4" v-else>
          <p>We don't support international shipping via the website yet.<br />Please contact us if you want to order outside of the Netherlands.</p>
        </div>

        <div class="d-flex justify-content-between mb-4">
          <p><strong>Total:</strong></p>
          <p><strong>{{ total }}</strong></p>
        </div>

        <Button block :disabled="!isValid" variant="primary" class="checkout__submit" @click="submit">Checkout</Button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'
import * as validator from 'validator'

const stripePromise = loadStripe(process.env.stripePublishableKey)

export default {
  head: {
    title: 'Checkout',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fray Handmade - Checkout'
      }
    ]
  },
  data() {
    return {
      customerInfo: {
        name: '',
        lastName: '',
        streetAddress: '',
        houseNumber: '',
        postalCode: '',
        country: 'The Netherlands',
        email: '',
        phoneNumber: ''
      },
      shipping: 8,
      errors: {}
    };
  },
  methods: {
    async submit () {
      const stripe = await stripePromise;

      const { sessionId } = await this.$api.post('orders', {
        products: this.products.map(({ id, size }) => ({
          productId: id,
          size
        })),
        customerInfo: this.customerInfo,
        shippingCosts: this.shipping
      })

      await stripe.redirectToCheckout({
        sessionId
      })
    },
  },
  computed: {
    subTotal() {
      return this.products.reduce((accumulator, { price }) => {
        return accumulator + price
      }, 0)
    },
    total() {
      return this.subTotal + this.shipping
    },
    products () {
      return this.$store.state.cart.products
    },
    isValid() {
      return Object.entries(this.customerInfo).every(([key, value]) => {
        if (key === 'email') {
          return validator.isEmail(value)
        }

        return !!value && value.length >= 2 && !this.isInternational
      })
    },
    isInternational() {
      return !['nl', 'ned', 'netherlands', 'the netherlands', 'holland'].includes(this.customerInfo.country.toLowerCase());
    }
  }
}
</script>

<style lang="scss">
.checkout {
  .row {
    > * {
      margin-bottom: $spacer;

      p {
        margin-bottom: calc($spacer * .5);
      }
    }
  }
}

.checkout__form {
  border-top: 1px solid $subtle;
  border-bottom: 1px solid $subtle;
  padding: calc($spacer * 3) 0;
  margin-bottom: calc($spacer * 2);
}
</style>
