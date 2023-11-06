import { useContext, useEffect, useState } from 'react';
import { Carousel, CarouselItem, Col, Form, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { Check, Plus } from 'react-bootstrap-icons';
import to from 'await-to-js';
import { useAsyncEffect } from 'rooks';
const md = require('markdown-it')();

import { useApi } from '@/hooks/useApi';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components';
import { formatProductSizes } from '@/helpers';

import './product.scss';

export const Product = () => {
  const { query: { id: productId }} = useRouter()
  const { get }: any = useApi();
  const { add, products }: any = useContext(CartContext);

  const [product, setProduct] = useState<any>({});
  const [selectedSize, setSelectedSize] = useState<any>(null);

  const productInCart = products?.find(({ id }: any) => id === product?.id);
  const sizeOptions = product ? [
    { value: null, text: '-' },
    ...Object.keys(product?.sizes || {}).map((key) => ({ text: key, value: key }))
  ] : [];

  useAsyncEffect(async () => {
    if (!productId) return;

    const data: any = await to(get(`products/${productId}`));

    const newProduct = {
      ...data[1],
      description: md.render(data[1]?.description || '')
    };

    setProduct(newProduct.sizes[0] ? formatProductSizes(newProduct) : newProduct)
  }, [productId])

  return (
    <div className="product">
      <div className="product__carousel">
        <Carousel
          controls={product.image?.data.length > 1}
          interval={null}
        >
          { product.image?.data.map((image: any) => (
            <Carousel.Item key={`slide-${image.url}`}>
              <img src={image.url} alt={image.url} />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div className="product__details">
        <h3 className="product__title">{ product.title }</h3>
        <p className="product__price">&euro;{ product.price }</p>
        <Form.Select value={selectedSize} onChange={(value) => setSelectedSize(value)}>
          { sizeOptions.map((option) => (
            <option key={option.value} value={option.value || ''}>{ option.text }</option>
          )) }
        </Form.Select>
        <p className="product__description body" v-html="product.description" />
        <Button
          onClick={() => add({ product, size: selectedSize }) }
          state={productInCart ? 'success' : !selectedSize ? 'disabled' : null}
          disabled={productInCart}
        >
          { productInCart ? 'Added to cart' : 'Add to cart' }
          { productInCart ? <Check v-if="productInCart" /> : <Plus v-else /> }
        </Button>
      </div>
    </div>
  )
}

export default Product;
