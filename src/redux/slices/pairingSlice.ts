import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Bird, fetchPairingDetailsIfNeeded } from '../api/productApi'

export interface PairingItem {
  id: string
  name: string
  thumbnail: string
  detail?: Bird
}

interface PairingState {
  father: PairingItem | null
  mother: PairingItem | null
}

// Trạng thái ban đầu với cả chim cha và chim mẹ
const initialState: PairingState = {
  father: null,
  mother: null
}

export const pairingSlice = createSlice({
  name: 'pairing',
  initialState,
  reducers: {
    setFather(state, action: PayloadAction<PairingItem>) {
      state.father = action.payload
    },
    setMother(state, action: PayloadAction<PairingItem>) {
      state.mother = action.payload
    },
    clearFather(state) {
      state.father = null
    },
    clearMother(state) {
      state.mother = null
    },
    clearPairing(state) {
      state.father = null
      state.mother = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPairingDetailsIfNeeded.fulfilled, (state, action: PayloadAction<Bird[]>) => {
      action.payload.forEach((bird: Bird) => {
        if (state.father && bird.id.toString() === state.father.id) {
          state.father.detail = bird
        }
        if (state.mother && bird.id.toString() === state.mother.id) {
          state.mother.detail = bird
        }
      })
    })
  }
})

export const { setFather, setMother, clearFather, clearMother, clearPairing } = pairingSlice.actions

export const PairingReducer = pairingSlice.reducer
