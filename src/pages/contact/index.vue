<template>
  <div class="contact">
    <div class="container--text">
      <h2 class="page-title">Contact</h2>
      <div class="spacer mt-5">
        <div>
          <ul>
            <li><b-icon-instagram class="mr-2" /><a href="https://instagram.com/frayamsterdam">@frayamsterdam</a></li>
            <li><b-icon-telephone-fill class="mr-2" /><a href="tel:0634042924">0634042924</a></li>
            <li><b-icon-envelope-fill class="mr-2" /><a href="mailto:frayamsterdam@gmail.com">frayamsterdam@gmail.com</a></li>
          </ul>
        </div>

        <div class="hr"></div>

        <div>
          <h4>Blazinbell</h4>
          <ul>
            <li>Czaar Peterstraat 263, 1018 PL Amsterdam</li>
            <li><a href="http://blazinbell.com/">Website</a></li>
          </ul>
        </div>

        <div>
          <h4>Independent outlet</h4>
          <ul>
            <li>Vijzelstraat 77, 1017 HG Amsterdam</li>
            <li><a href="https://skateboardsamsterdam.nl/">Website</a></li>
          </ul>
        </div>

        <div class="hr"></div>

        <h3>Commissions</h3>
        <div class="contact__form">
          <b-row>
            <b-col cols="6">
              <p>Name</p>
              <b-input name="name" v-model="commissionInfo.name" />
            </b-col>
            <b-col cols="6">
              <p>Email</p>
              <b-input name="email" v-model="commissionInfo.email" />
            </b-col>

            <b-col cols="12">
              <p>Message</p>
              <b-textarea rows="5" name="message" v-model="commissionInfo.message" />
            </b-col>
          </b-row>
          <b-row class="justify-content-end">
            <b-col cols="5">
              <Button
                block
                type="submit"
                :disabled="!isValid"
                :state="status || 'primary'"
                class="checkout__submit"
                @click="submit"
              >
                Send
              </Button>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'
import * as validator from 'validator'

export default {
  head: {
    title: 'Contact',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Fray Handmade - Contact'
      }
    ]
  },
  layout: 'contact',
  data() {
    return {
      commissionInfo: {
        name: '',
        email: '',
        message: '',
      },
      errors: {},
      status: ''
    };
  },
  methods: {
    async submit () {
      try {
        await this.$api.post('commission/send', {
          commissionInfo: this.commissionInfo
        })

        this.status = 'success'

        setTimeout(() => {
          this.status = ''

          this.commissionInfo = {
            name: '',
            email: '',
            message: '',
          };
        }, 1000)
      } catch (err) {
        this.status = 'danger'

        setTimeout(() => {
          this.status = ''
        }, 1000)
      }
    },
  },
  computed: {
    isValid() {
      return Object.entries(this.commissionInfo).every(([key, value]) => {
        if (key === 'email') {
          return validator.isEmail(value)
        }

        return !!value && value.length > 3
      })
    }
  }
}
</script>

<style lang="scss">
.contact {
  .row {
    > * {
      margin-bottom: $spacer;

      p {
        margin-bottom: calc($spacer * .5);
      }
    }
  }
}
</style>
