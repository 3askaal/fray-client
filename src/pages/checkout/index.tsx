import { useContext, useState } from 'react';
import { Col, Form, Row, Stack } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import to from 'await-to-js';
import isEmail from 'validator/lib/isEmail';

import { Button } from '@/components';
import { CartContext } from '@/context/CartContext';
import { useApi } from '@/hooks/useApi';

import './checkout.scss';
import { HeadExtend } from '@/components/Head';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export const Checkout = () => {
  const { post } = useApi();
  const { remove, products }: any = useContext(CartContext);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    lastName: '',
    streetAddress: '',
    houseNumber: '',
    postalCode: '',
    country: 'The Netherlands',
    email: '',
    phoneNumber: ''
  });

  // useAsyncEffect(async () => {
  //   const data = await get('products');

  //   setProducts(
  //     data
  //       .map((product: any) => product.sizes && product.sizes[0] ? formatProductSizes(product) : product)
  //       .map(({ sizes, ...product }: any) => ({
  //       ...product,
  //       sizes: sizes ? Object.keys(sizes).join(' / ') : null,
  //     }))
  //   );

  //   order();
  // }, [])

  const submit = async () => {
    const stripe: any = await stripePromise;

    const [submitErr, sumbmitSuccess] = await to(post('orders', {
      products: products.map(({ id, size }: any) => ({
        productId: id,
        size
      })),
      customerInfo
      // shippingCosts: this.shipping
    }))

    if (submitErr) {
      throw submitErr;
    }

    await stripe.redirectToCheckout({
      sessionId: sumbmitSuccess.sessionId
    })
  }

  const shipping = 8;
  const subTotal = products.reduce((accumulator: any, { price }: any) => accumulator + price, 0);
  const total = subTotal + shipping;

  const isValid = () => {
    return Object.entries(customerInfo).every(([key, value]) => {
      if (key === 'email') {
        return isEmail(value)
      }

      return !!value && value.length >= 2 && !isInternational
    })
  }

  const isInternational = !['nl', 'ned', 'netherlands', 'the netherlands', 'holland'].includes(customerInfo.country.toLowerCase());

  return (
    <>
      <HeadExtend title="Checkout" />
      <div className="checkout mt-5">
        <div className="checkout__form">
          <Row>
            <Col xs="6">
              <p>First Name</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, name: value })} />
            </Col>
            <Col xs="6">
              <p>Last Name</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, lastName: value })} />
            </Col>

            <Col xs="6">
              <p>Street Address</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, streetAddress: value })} />
            </Col>
            <Col xs="6">
              <p>House Number</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, houseNumber: value })} />
            </Col>

            <Col xs="6">
              <p>Postal Code</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, postalCode: value })} />
            </Col>
            <Col xs="6">
              <p>Country</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, country: value })} />
            </Col>

            <Col xs="6">
              <p>Email</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, email: value })} />
            </Col>
            <Col xs="6">
              <p>Phone Number</p>
              <Form.Text onChange={(value: any) => setCustomerInfo({ ...customerInfo, phoneNumber: value })} />
            </Col>
          </Row>
        </div>


        { products.length && (
          <Row className="justify-content-end">
            <Col xs="5">
              <Stack gap={4}>
                <div className="d-flex justify-content-between">
                  <p><strong>Subtotal:</strong></p>
                  <p><strong>{ subTotal() }</strong></p>
                </div>

                { !!(!customerInfo.country.length || !isInternational) ? (
                  <div className="d-flex justify-content-between">
                    <p><strong>Shipping:</strong></p>
                    <p><strong>{ shipping }</strong></p>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between">
                    <p>We don&apos;t support international shipping via the website yet.<br />Please contact us if you want to order outside of the Netherlands.</p>
                  </div>
                ) }

                <div className="d-flex justify-content-between">
                  <p><strong>Total:</strong></p>
                  <p><strong>{ total() }</strong></p>
                </div>
              </Stack>
              <Button block={true} disabled={!isValid} variant="primary" className="checkout__submit" onClick={submit}>Checkout</Button>
            </Col>
          </Row>
        )}
      </div>
    </>
  )
}

export default Checkout;
