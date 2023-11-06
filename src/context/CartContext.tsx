import { pull } from 'lodash';
import React, { createContext, useEffect, useState } from 'react'

export interface CartContextType {
  [key: string]: any;
}

export const CartContext = createContext<CartContextType>({})

export const CartProvider = ({ children }: any) => {
  const [products, setProductsState] = useState<any>([]);

  useEffect(() => {
    let newProducts = sessionStorage.getItem('cart');
    if (!newProducts) return;

    setProductsState(JSON.parse(newProducts));
  }, [])

  const setProducts = (data: any) => {
    sessionStorage.setItem('cart', JSON.stringify(data));
    setProductsState(() => data);
  }

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
    const newProducts = pull(products, item)

    setProducts([...newProducts]);
  }

  return (
    <CartContext.Provider
      value={{
        products,
        add,
        remove
      }}
    >
      { children }
    </CartContext.Provider>
  )
}
