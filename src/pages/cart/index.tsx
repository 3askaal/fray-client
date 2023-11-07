import { useContext } from 'react';
import Link from 'next/link';
import { Carousel, Col, Row, Stack } from 'react-bootstrap';

import { CartContext } from '@/context/CartContext';
import { Button } from '@/components';

import './cart.scss';

export const Cart = () => {
  const { remove, products }: any = useContext(CartContext);
  const subTotal = products?.reduce((accumulator: any, { price }: any) => accumulator + price, 0)

  return (
    <div className="cart mt-5">
      <div className="cart__products">
        <div className="container">
          { products?.length ? products.map((product: any) => (
            <Row className="cart__products__product" key={product.title}>
              <Col xs="3">
                {/* <a href={`/product/${product.id}`}> */}
                  <Carousel
                    controls={product.image.data.length > 1}
                    interval={null}
                  >
                    { product.image.data.map((image: any) => (
                      <Carousel.Item key={`slide-${image.url}`}>
                        <img src={image.url} alt={image.url} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                {/* </a> */}
              </Col>
              <Col xs="9">
                <div className="cart__products__product__title">
                  <a href={`/product/${product.id}`}>{ product.title }</a>
                </div>
                <p className="cart__products__product__size">Size: { product.size }</p>
                <Button
                  size="s"
                  className="cart__products__product__remove"
                  variant="outline-danger"
                  onClick={() => remove(product.id)}
                >
                  Remove from cart
                </Button>
              </Col>
            </Row>
          )) : (
            <Row>
              <Col>
                <div className="cart__products__message">
                  <p>No items in cart, go to our <Link href="/shop">shop</Link> page to see what&apos;s available for sale.</p>
                </div>
              </Col>
            </Row>
          ) }
        </div>
      </div>

      { !!products?.length && (
        <Row className="justify-content-end">
          <Col xs="5">
            <Stack gap={4}>
              <div className="d-flex justify-content-between">
                <p><strong>Subtotal:</strong></p>
                <p><strong>{ subTotal }</strong></p>
              </div>

              <Button to="checkout" block className="cart__submit">Go to checkout</Button>
            </Stack>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default Cart;
