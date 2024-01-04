import { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Stack } from 'react-bootstrap';
import { useAsyncEffect } from 'rooks';
import axios from 'axios';
import to from 'await-to-js';
import isEmail from 'validator/lib/isEmail';
import { loadStripe } from '@stripe/stripe-js';

import { Button } from '@/components';
import { HeadExtend } from '@/components/Head';
import { CartContext } from '@/context/CartContext';
import { useApi } from '@/hooks/useApi';

import './checkout.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');
const usernamePasswordBuffer = Buffer.from(`${process.env.NEXT_PUBLIC_SENDCLOUD_PUBLIC}:${process.env.NEXT_PUBLIC_SENDCLOUD_SECRET}`);
const base64data = usernamePasswordBuffer.toString('base64');

const getSenderAddress = async () => {
  const [getSenderAddressError, getSenderAddressSuccess] = await to(axios.get(`https://panel.sendcloud.sc/api/v2/user/addresses/sender`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Basic ${base64data}`,
    },
    withCredentials: false,
  }));

  console.error('getSenderAddressError: ', getSenderAddressError);
  console.log('getSenderAddressSuccess: ', getSenderAddressSuccess);

  return getSenderAddressSuccess;
}

const getShippingMethods = async (query: any) => {
  const [getShippingMethodsError, getShippingMethodsSuccess] = await to(axios.get(`https://panel.sendcloud.sc/api/v2/shipping_methods?${stringify(query)}`, {
    auth: {
      username: process.env.NEXT_PUBLIC_SENDCLOUD_PUBLIC || '',
      password: process.env.NEXT_PUBLIC_SENDCLOUD_SECRET || ''
    },
    headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Credentials': 'true',
    //   'Accept': 'application/json',
    },
    // withCredentials: true,
  }));


  console.error('getShippingMethodsError: ', getShippingMethodsError?.message);
  console.log('getShippingMethodsSuccess: ', getShippingMethodsSuccess);

  return getShippingMethodsSuccess
}



const getShippingPrice = async (query: any) => {
  const [getShippingPriceError, getShippingPriceSuccess] = await to(axios.get(`https://panel.sendcloud.sc/api/v2/shipping-price${stringify(query)}`, {
    auth: {
      username: process.env.NEXT_PUBLIC_SENDCLOUD_PUBLIC || '',
      password: process.env.NEXT_PUBLIC_SENDCLOUD_SECRET || ''
    },
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Credentials': 'true',
    //   'Accept': 'application/json',
    // },
    // withCredentials: true,
  }));

  console.log('getShippingPriceError: ', getShippingPriceError);
  console.log('getShippingPriceSuccess: ', getShippingPriceSuccess);

  return getShippingPriceSuccess
}

export const Checkout = () => {
  const { post } = useApi();
  // const { remove, products }: any = useContext(CartContext);
  const products: any[] = [];

  const [customerInfo, setCustomerInfo] = useState({
    name: 'Lorem',
    lastName: 'Ipsum',
    streetAddress: 'Nestelmakerstraat',
    houseNumber: '49',
    postalCode: '4813KA',
    country: 'The Netherlands',
    email: 'loremipsum@gmail.com',
    phoneNumber: '0612345678'
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

  useAsyncEffect(async () => {
    const senderAddressId = await getSenderAddress()
    console.log('senderAddressId: ', senderAddressId);

    // const test = await getShippingMethods({
    //   from_postal_code: customerInfo.postalCode,
    //   is_return: false,
    //   sender_address: senderAddressId,
    //   service_point_id: 10875349,
    //   to_country: 'NL',
    //   to_postal_code: '1092AT',
    // })

    // console.log('test: ', test);

    // getShippingPrice({
    //   from_country: 'NL',
    //   to_country: this.customerInfo.country,
    //   shipping_method_id: 0,
    //   weight: 0.5,
    //   weight_unit: 'kilogram'
    // })
  }, [customerInfo])

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
              <Form.Control defaultValue={customerInfo.name} onChange={(value: any) => setCustomerInfo({ ...customerInfo, name: value })} />
            </Col>
            <Col xs="6">
              <p>Last Name</p>
              <Form.Control defaultValue={customerInfo.lastName} onChange={(value: any) => setCustomerInfo({ ...customerInfo, lastName: value })} />
            </Col>

            <Col xs="6">
              <p>Street Address</p>
              <Form.Control defaultValue={customerInfo.streetAddress} onChange={(value: any) => setCustomerInfo({ ...customerInfo, streetAddress: value })} />
            </Col>
            <Col xs="6">
              <p>House Number</p>
              <Form.Control defaultValue={customerInfo.houseNumber} onChange={(value: any) => setCustomerInfo({ ...customerInfo, houseNumber: value })} />
            </Col>

            <Col xs="6">
              <p>Postal Code</p>
              <Form.Control defaultValue={customerInfo.postalCode} onChange={(value: any) => setCustomerInfo({ ...customerInfo, postalCode: value })} />
            </Col>
            <Col xs="6">
              <p>Country</p>
              <Form.Control defaultValue={customerInfo.country} onChange={(value: any) => setCustomerInfo({ ...customerInfo, country: value })} />
            </Col>

            <Col xs="6">
              <p>Email</p>
              <Form.Control defaultValue={customerInfo.email} onChange={(value: any) => setCustomerInfo({ ...customerInfo, email: value })} />
            </Col>
            <Col xs="6">
              <p>Phone Number</p>
              <Form.Control defaultValue={customerInfo.phoneNumber} onChange={(value: any) => setCustomerInfo({ ...customerInfo, phoneNumber: value })} />
            </Col>
          </Row>
        </div>


        { products.length && (
          <Row className="justify-content-end">
            <Col xs="5">
              <Stack gap={4}>
                <div className="d-flex justify-content-between">
                  <p><strong>Subtotal:</strong></p>
                  <p><strong>{ subTotal }</strong></p>
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
                  <p><strong>{ total }</strong></p>
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
