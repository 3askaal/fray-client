<template>
  <div class="products">
    <div class="products__actions">
      <div class="products__actions__sort">
        <b-form-select v-model="ordering.type" :options="orderingOptions" />
      </div>
      <div class="products__actions__order" @click="toggleOrder">
        <b-icon-arrow-down v-if="ordering.direction === 'asc'" font-scale="1.5" />
        <b-icon-arrow-up v-else font-scale="1.5" />
      </div>
    </div>
    <b-row class="m-0 aic">
      <b-col sm="12" md="6" lg="4" class="products__item" v-for="product in products" :key="product.id">
        <router-link :to="`/product/${product.id}`">
          <div class="products__item__image" v-if="product.image && product.image.data">
            <b-carousel
              v-model="product.currentSlide"
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
            <div class="products__item__content__extra" v-if="product.sizes">
              <p>{{ product.sizes }}</p>
            </div>
          </div>
          <div class="products__item__content">
            <p v-html="product.title" />
            <p><strong>€ {{ product.price }}</strong></p>
          </div>
        </router-link>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { formatProductPrice } from '../../helpers';
import { orderBy } from 'lodash';

export default {
  head: {
    title: 'Shop',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fray Handmade - Shop'
      }
    ]
  },
  async mounted() {
    const products = await this.$api.get('products');

    this.products = products
      .map((product) => product.sizes && product.sizes[0] ? formatProductPrice(product) : product)
      .map(({ sizes, ...product }) => ({
        ...product,
        sizes: sizes ? Object.keys(sizes).join(' / ') : null,
      }));

    this.order();
  },
  data() {
    return {
      products: [],
      currentSlide: null,
      ordering: {
        type: 'publishedAt',
        direction: 'asc'
      },
      orderingOptions: [
        { text: 'Date', value: 'publishedAt' },
        { text: 'Price', value: 'price' },
      ]
    }
  },
  methods: {
    toggleOrder() {
      this.ordering.direction = this.ordering.direction === 'asc' ? 'desc' : 'asc';
      this.order();
    },
    order() {
      this.products = orderBy(this.products, [this.ordering.type], [this.ordering.direction]);
      this.$forceUpdate();
    }
  },
  watch: {
    'ordering.type': function() {
      this.ordering.direction = 'asc';
      this.order();
    }
  }
}
</script>

<style lang="scss">
.products {
  align-items: center;
  justify-content: center;
  width: 100%;
}

.products__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  * + * {
    margin-left: 1rem;
  }
}

.products__actions__order {
  cursor: pointer;
}

.row {
  justify-content: center;
}

.products__item {
  display: flex;
  margin: 2rem;
  padding: 1.5rem 1rem;

  a {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    color: inherit;
    text-decoration: none;
  }
}

.products__item__image {
  display: flex;
  align-items: center;
  flex-grow: 1;
  aspect-ratio: 1 / 1;
  position: relative;
  border-radius: .5rem;
  overflow: hidden;

  div, img {
    height: 100%;
  }

  img {
    display: block;
    width: 100%;
    object-fit: cover;
    object-position: center center;
  }

  .carousel-control-prev,
  .carousel-control-next {
    display: none;
  }

  &:hover {
    .carousel-control-prev,
    .carousel-control-next {
      display: flex;
    }
  }
}

.products__item__content {
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
  margin-top: 1rem;
  z-index: 100;

  > * + * {
    margin-top: .25rem;
  }
}

.products__item__content__extra {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  max-height: 0;
  transition: all .4s ease;

  .products__item:hover & {
    background-color: rgba(white, .9);
    max-height: 50px;
  }
}

.carousel {
  width: 100%;
}

.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E") !important;
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E") !important;
}
</style>
