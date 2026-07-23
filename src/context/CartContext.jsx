import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as cartApi from '../api/cart'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user, isLoading: authLoading } = useAuth()
  const [cart, setCart] = useState(null)

  const refresh = useCallback(() => {
    return cartApi.getCart().then(data => {
      setCart(data)
      return data
    })
  }, [])

  // Fetch the cart once we know who's logged in (on app load if already
  // authenticated, or right after login); drop it on logout.
  useEffect(() => {
    if (authLoading) return
    if (user) {
      refresh().catch(() => {})
    } else {
      setCart(null)
    }
  }, [user, authLoading, refresh])

  const addToCart = useCallback((productId, quantity = 1) => {
    return cartApi.addItem(productId, quantity).then(data => {
      setCart(data)
      return data
    })
  }, [])

  const setQuantity = useCallback((productId, quantity) => {
    // Matches backend PATCH semantics: quantity <= 0 removes the line.
    const request = quantity > 0
      ? cartApi.updateItemQuantity(productId, quantity)
      : cartApi.removeItem(productId)
    return request.then(data => {
      setCart(data)
      return data
    })
  }, [])

  const removeFromCart = useCallback(productId => {
    return cartApi.removeItem(productId).then(data => {
      setCart(data)
      return data
    })
  }, [])

  const clear = useCallback(() => {
    return cartApi.clearCart().then(data => {
      setCart(data)
      return data
    })
  }, [])

  const itemCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart]
  )

  const value = useMemo(
    () => ({ cart, itemCount, addToCart, setQuantity, removeFromCart, clear, refresh }),
    [cart, itemCount, addToCart, setQuantity, removeFromCart, clear, refresh]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
