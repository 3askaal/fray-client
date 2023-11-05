import React, { createContext, useState } from 'react'
import { useSessionstorageState } from 'rooks';

export interface CartContextType {
  [key: string]: any;
}

export const CartContext = createContext<CartContextType>({})

export const CartProvider = ({ children }: any) => {
  const [products, setProducts] = useSessionstorageState<any>('cart', null);

  const add = ({ product, size }: any) => {
    const newProducts = [
      ...products,
      { ...product, size }
    ]

    setProducts(newProducts);
  }

  const increase = (productId: any) => {
    const newProducts = products.map((item: any) => {
      if (item.product.id === productId) {
        return {
          ...item,
          amount: item.amount + 1
        }
      }

      return item
    })

    setProducts(newProducts);
  }

  const decrease = (productId: any) => {
    const newProducts = products.map((item: any) => {
      if (item.product.id === productId) {
        return {
          ...item,
          amount: item.amount + 1
        }
      }

      return item
    })

    setProducts(newProducts);
  }

  const remove = (productId: any) => {
    const item = products.find(({ id }: any) => id === productId);
    const newProducts = products.splice(products.indexOf(item), 1);

    setProducts(newProducts);
  }

  return (
    <CartContext.Provider
      value={{
        products,
        add,
        increase,
        decrease,
        remove
      }}
    >
      { children }
    </CartContext.Provider>
  )
}
