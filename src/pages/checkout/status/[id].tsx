import { useState } from 'react';
import { useAsyncEffect } from 'rooks';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import to from 'await-to-js';

import { useApi } from '@/hooks/useApi';

import './status.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK || '');

export const Status = () => {
  const { query: { id: sessionId }} = useRouter()
  const { post } = useApi();
  const [status, setStatus] = useState('pending');
  const [order, setOrder] = useState<any>({});

  useAsyncEffect(async () => {
    if (!sessionId) return;

    const [getOrderError, getOrderSuccess] = await to(post('orders/confirm', {
      sessionId
    }))

    if (getOrderError) {
      setStatus('error')
    }

    setStatus('success')
    setOrder(getOrderSuccess)
  }, [sessionId])

  return (
    <div className="status spacer">
      { !!(status === 'pending') && (
        <h1 className="status__title">Your order is being processed!</h1>
      ) }
      { !!(status === 'success') && (
        <>
          <h1 className="status__title">Payment Completed</h1>
          <p className="status__order-desc">Your order with Order ID: #{ order.id } was successful.</p>
          <ul className="status__products">
            { order.products.map((product: any) => (
              <li className="status__products__product" key={product.id}>
                <span>{ product.title }</span>
                <span>-</span>
                <span>€ { product.price }</span>
              </li>
            )) }
          </ul>
          <p className="status__order-extra">You've received a confirmation email with further information.<br />For questions or requests please contact our support email.</p>
        </>
      ) }
      { !!(status === 'error') && (
        <>
          <h1 className="status__title">Payment Failed</h1>
        </>
      ) }
    </div>
  )
}

export default Status;
