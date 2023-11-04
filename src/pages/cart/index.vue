<template>
  <div class="cart mt-5">
    <div class="cart__products">
      <div class="container">
        <template v-if="products.length">
          <b-row class="cart__products__product" v-for="product in products" :key="product.title">
            <b-col cols="3">
              <a :href="`/product/${product.id}`">
                <b-carousel
                  v-model="currentSlide"
                  :img-height="480"
                  :controls="product.image.data.length > 1"
                  no-animation
                  :interval="0"
                >
                  <b-carousel-slide
                    v-for="(image, index) in product.image.data"
                    :key="`slide-${index}`"
                    :img-src="image.url"
                  />
                </b-carousel>
              </a>
            </b-col>
            <b-col cols="9">
              <div class="cart__products__product__title">
                <a :href="`/product/${product.id}`">{{ product.title }}</a>
              </div>
              <p class="cart__products__product__size">Size: {{ product.size }}</p>
              <Button
                size="s"
                class="cart__products__product__remove"
                variant="outline-danger"
                @click="() => remove(product.id)"
              >
                Remove from cart
              </Button>
            </b-col>
          </b-row>
        </template>
        <template v-else>
          <b-row>
            <b-col>
              <div class="cart__products__message">
                <p>No items in cart, go to our <router-link to="/shop">shop</router-link> page to see what's available for sale.</p>
              </div>
            </b-col>
          </b-row>
        </template>
      </div>
    </div>

    <b-row class="justify-content-end" v-if="products.length">
      <b-col cols="5">
        <div class="d-flex justify-content-between mb-4">
          <p><strong>Subtotal:</strong></p>
          <p><strong>{{ subTotal }}</strong></p>
        </div>

        <Button to="checkout" block class="cart__submit">Go to checkout</Button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  head: {
    title: 'Cart',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fray Handmade - Cart'
      }
    ]
  },
  methods: {
    ...mapMutations({
      remove: 'cart/remove'
    })
  },
  computed: {
    subTotal() {
      return this.products.reduce((accumulator, { price }) => accumulator + price, 0)
    },
    products () {
      return this.$store.state.cart.products
    }
  }
}
</script>

<style lang="scss">
.cart__products {
  border-top: 1px solid $subtle;
  border-bottom: 1px solid $subtle;
  padding: calc($spacer * 4 ) 0;
  margin-bottom: calc($spacer * 2);
}

.cart__products__message {
  display: flex;
  color: $subtle;
  justify-content: center;
}

.cart__products__product {
  display: flex;

  + .cart__products__product {
    margin-top: calc($spacer * 3);
  }
}

.cart__products__product__image {
  display: block;
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  object-position: center;
}


.cart__products__product__title {
  margin-bottom: .5rem;

  a {
    color: inherit;
    text-decoration: underline;
  }
}

.cart__products__product__size {
  margin-bottom: 1rem;
}

.cart__products__product__desc {
  margin-bottom: 1rem;
}

.cart__products__product__amount {
  min-width: 50px;
  width: 50px;
}
</style>
