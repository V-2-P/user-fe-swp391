import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Bird, fetchCartDetailsIfNeeded } from '../api/productApi'

// Định nghĩa kiểu cho một mục trong giỏ hàng
export interface CartItem {
  id: string
  quantity: number
  price: number
  detail?: Bird
}

// Định nghĩa kiểu cho trạng thái của giỏ hàng
export interface CartState {
  items: Record<string, CartItem> // Record<Keys, Type> tạo một object với key là string và value là CartItem
  totalQuantity: number
  totalPrice: number
}

// Trạng thái ban đầu
const initialState: CartState = {
  items: {},
  totalQuantity: 0,
  totalPrice: 0
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<{ id: string; price: number }>) {
      const newItem = action.payload
      const existingItem = state.items[newItem.id]
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items[newItem.id] = { ...newItem, quantity: 1 }
      }
      state.totalQuantity++
      state.totalPrice += action.payload.price
    },
    removeItemFromCart(state, action: PayloadAction<string>) {
      const id = action.payload
      const existingItem = state.items[id]
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity
        state.totalPrice -= existingItem.detail!.price * existingItem.quantity
        delete state.items[id]
      }
    },
    adjustItemQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload
      const existingItem = state.items[id]
      if (existingItem && quantity > 0) {
        state.totalPrice += (quantity - existingItem.quantity) * existingItem.detail!.price
        state.totalQuantity += quantity - existingItem.quantity
        existingItem.quantity = quantity
      }
    },
    clear() {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartDetailsIfNeeded.fulfilled, (state, action: PayloadAction<Bird[]>) => {
      action.payload.forEach((bird: Bird) => {
        const id = bird.id
        const cartItem = state.items[id]
        if (cartItem) {
          cartItem.detail = bird
        }
      })
    })
  }
})

export const { addItemToCart, removeItemFromCart, adjustItemQuantity, clear } = cartSlice.actions

export const CartReducer = cartSlice.reducer
