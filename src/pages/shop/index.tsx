import { useState } from 'react';
import Link from 'next/link';
import { Carousel, Col, Form, Row } from 'react-bootstrap';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';
import { useAsyncEffect } from 'rooks';
import { orderBy } from 'lodash';

import { useApi } from '@/hooks/useApi';
import { formatProductPrice } from '@/helpers';
import './shop.scss';

export const Shop = () => {
  const { get } = useApi();
  const [ordering, setOrdering] = useState({ type: '', direction: '' });
  const [products, setProducts] = useState([]);

  useAsyncEffect(async () => {
    const data = await get('products');

    setProducts(
      data
        .map((product: any) => product.sizes && product.sizes[0] ? formatProductPrice(product) : product)
        .map(({ sizes, ...product }: any) => ({
        ...product,
        sizes: sizes ? Object.keys(sizes).join(' / ') : null,
      }))
    );

    order();
  }, [])

  const toggleOrder = () => {
    setOrdering({ ...ordering, direction: ordering.direction === 'asc' ? 'desc' : 'asc' });
    order()
  }

  const order = () => {
    setProducts(orderBy(products, [ordering.type], [ordering.direction]));
  }

  return (
    <div className="products">
      <div className="products__actions">
        <div className="products__actions__sort">
          <Form.Select value={ordering.type} onChange={(value: string) => setOrdering({ ...ordering, type: value })} />
        </div>
        <div className="products__actions__order" onClick={toggleOrder}>
          { ordering.direction === 'asc' ? <ArrowDown font-scale="1.5" /> : <ArrowUp font-scale="1.5" /> }
        </div>
      </div>
      <Row className="m-0 aic">
        { products.map((product: any) => (
          <Col sm="12" md="6" lg="4" className="products__item" key={product.id}>
            <Link href={`/product/${product.id}`}>
              { !!(product.image && product.image.data) && (
                <div className="products__item__image">
                  <Carousel
                    controls={product.image.data.length > 1}
                    interval={0}
                  >
                    { product.image.data.map((image: any) => (
                      <Carousel.Item key={`slide-${image.url}`}>
                        <img src={image.url} alt={image.url} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <div className="products__item__content__extra">
                    <p>{ product.sizes }</p>
                  </div>
                </div>
              ) }
              <div className="products__item__content">
                <p dangerouslySetInnerHTML={{ __html: product.title }} />
                <p><strong>€ { product.price }</strong></p>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Shop;
