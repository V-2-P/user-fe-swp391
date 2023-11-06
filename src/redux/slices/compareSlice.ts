import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Bird, fetchCompareDetailsIfNeeded } from '../api/productApi'

export interface CompareItem {
  id: string
  name: string
  thumbnail: string
  detail?: Bird
}

interface CompareState {
  items: Record<string, CompareItem> // Record<Keys, Type> tạo một object với key là string và value là Bird
}

// Trạng thái ban đầu
const initialState: CompareState = {
  items: {}
}

export const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare(state, action: PayloadAction<{ id: string; name: string; thumbnail: string }>) {
      const product = action.payload
      state.items[product.id] = product
    },
    removeFromCompare(state, action: PayloadAction<string>) {
      delete state.items[action.payload]
    },
    clearCompare(state) {
      state.items = {}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompareDetailsIfNeeded.fulfilled, (state, action: PayloadAction<Bird[]>) => {
      action.payload.forEach((bird: Bird) => {
        // Assuming that the bird id is a string or you can convert it to string if needed
        const id = bird.id
        const compareItem = state.items[id]
        if (compareItem) {
          compareItem.detail = bird
        }
      })
    })
  }
})

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions

export const CompareReducer = compareSlice.reducer
