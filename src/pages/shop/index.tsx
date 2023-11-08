import { useState } from 'react';
import Link from 'next/link';
import { Carousel, Col, Form, Row } from 'react-bootstrap';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';
import { useAsyncEffect } from 'rooks';
import { orderBy } from 'lodash';

import { useApi } from '@/hooks/useApi';
import { formatProductSizes } from '@/helpers';
import './shop.scss';
import { HeadExtend } from '@/components/Head';

export const Shop = () => {
  const { get } = useApi();
  const [ordering, setOrdering] = useState<{ type: string, direction: 'asc' | 'desc' }>({ type: 'publishedAt', direction: 'asc' });
  const [products, setProducts] = useState([]);

  useAsyncEffect(async () => {
    const data = await get('products');

    const newProducts = data
      .map((product: any) => product.sizes && product.sizes[0] ? formatProductSizes(product) : product)
      .map(({ sizes, ...product }: any) => ({
        ...product,
        sizes: sizes ? Object.keys(sizes).join(' / ') : null,
      }))

    setProducts(newProducts);
  }, [])


  const orderOptions = [
    { text: 'Date', value: 'publishedAt' },
    { text: 'Price', value: 'price' },
  ];

  const orderedProducts = orderBy(products, [ordering.type], [ordering.direction]);

  return (
    <>
      <HeadExtend title="Shop" />
      <div className="products">
        <div className="products__actions">
          <div className="products__actions__sort">
            <Form.Select value={ordering.type} onChange={(event) => setOrdering({ ...ordering, type: event.target.value })}>
              { orderOptions.map((option) => (
                <option key={option.value} value={option.value || ''}>{ option.text }</option>
              )) }
            </Form.Select>
          </div>
          <div className="products__actions__order" onClick={() => setOrdering({ ...ordering, direction: ordering.direction === 'asc' ? 'desc' : 'asc' })}>
            { ordering.direction === 'asc' ? <ArrowDown size="1.2rem" /> : <ArrowUp size="1.2rem" /> }
          </div>
        </div>
        <Row>
          { orderedProducts.map((product: any) => (
            <Col sm="12" md="6" lg="4" className="products__item" key={product.id}>
              <Link href={`/product/${product.id}`}>
                { !!(product.image && product.image.data) && (
                  <div className="products__item__image">
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
    </>
  )
}

export default Shop;
