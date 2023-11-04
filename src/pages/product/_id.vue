<template>
  <div class="product" v-if="product">
    <div class="product__carousel">
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
    </div>
    <div class="product__details">
      <h3 class="product__title">{{ product.title }}</h3>
      <p class="product__price">&euro;{{ product.price }}</p>
      <b-form-select v-model="selectedSize" :options="sizeOptions" v-if="product.sizes" />
      <p class="product__description body" v-html="product.description" />
      <Button @click="() => add({ product, size: selectedSize })" :state="productInCart ? 'success' : !selectedSize ? 'disabled' : null" :disabled="productInCart">
        {{ productInCart ? 'Added to cart' : 'Add to cart' }}
        <b-icon-check v-if="productInCart" />
        <b-icon-plus v-else />
      </Button>
    </div>
  </div>
</template>

<script>
import to from 'await-to-js'
import { mapMutations, mapState } from 'vuex'
import { formatProductPrice } from '../../helpers'
const md = require('markdown-it')();

export default {
  head: {
    title: 'Product',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fray Handmade - Product'
      }
    ]
  },
  async mounted() {
    const productId = this.$route.params.id;
    const data = await to(this.$api.get(`products/${productId}`));

    const product = {
      ...data[1],
      description: md.render(data[1]?.description || '')
    };

    this.product = product.sizes[0] ? formatProductPrice(product) : product;

    this.sizeOptions = [
      { value: null, text: '-' },
      ...Object.keys(this.product.sizes).map((key) => ({ text: key, value: key }))
    ]
  },
  data() {
    return {
      product: null,
      sizeOptions: null,
      selectedSize: null,
      currentSlide: null,
    }
  },
  methods: {
    ...mapMutations({
      add: 'cart/add'
    }),
    ...mapState(['cart'])
  },
  computed: {
    productInCart() {
      return !!this.$store.state.cart.products.find(({ id }) => id === this.product?.id)
    }
  },
}
</script>

<style lang="scss">
.product {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 600px;
  padding-bottom: 4rem;
}

.product__details {
  > * + * {
    margin-top: $spacer;
  }
}

.product__carousel {
  margin-bottom: 3rem;
}

.product__price {
  font-weight: bold;
  font-size: 1.25rem;
  color: $subtle;
}

.product__description {
  margin-bottom: 2rem;
}

.custom-select {
  width: auto;
  background-color: transparent;
}
</style>
