import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './reduxHook'
import {
  clear,
  addItemToCart,
  fetchProductDetailsIfNeeded,
  removeItemFromCart,
  adjustItemQuantity
} from '~/redux/slices'

export const useCart = () => {
  const cart = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()

  const addToCart = useCallback(
    (data: { id: string; price: number }) => {
      dispatch(addItemToCart(data))
      dispatch(fetchProductDetailsIfNeeded())
    },
    [dispatch]
  )

  const removeFromCart = useCallback(
    (id: string) => {
      dispatch(removeItemFromCart(id))
    },
    [dispatch]
  )
  const adjustQuantity = useCallback(
    (data: { id: string; quantity: number }) => {
      dispatch(adjustItemQuantity(data))
    },
    [dispatch]
  )
  const clearCart = useCallback(() => {
    dispatch(clear())
  }, [dispatch])
  const memoizedCart = useMemo(() => cart, [cart])
  return {
    cart: memoizedCart,
    addToCart,
    removeFromCart,
    adjustQuantity,
    clearCart
  }
}
