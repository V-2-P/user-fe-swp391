import { createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../store'
import axiosClient from '~/utils/api/axiosClient'
interface BirdImage {
  id: number
  imageUrl: string
}

interface BirdCategory {
  id: number
  name: string
}

interface BirdType {
  id: number
  name: string
}

export interface Bird {
  createdAt: string
  updatedAt: string
  id: number
  name: string
  price: number
  thumbnail: string
  description: string
  category: BirdCategory
  birdType: BirdType
  status: boolean
  purebredLevel: string
  competitionAchievements: number
  age: string
  gender: string
  color: string
  quantity: number
  birdImages: BirdImage[]
}
export const fetchCartDetailsIfNeeded = createAsyncThunk('cart/fetchDetails', async (_, { getState }) => {
  const state = getState() as RootState

  const ids = Object.keys(state.cart.items).join(',')
  const response = await axiosClient.get(`/birds/by-ids?ids=${ids}`)
  return response.data
})
export const fetchCompareDetailsIfNeeded = createAsyncThunk('compare/fetchDetails', async (_, { getState }) => {
  const state = getState() as RootState

  const ids = Object.keys(state.compare.items).join(',')
  const response = await axiosClient.get(`/birds/by-ids?ids=${ids}`)
  return response.data
})
export const fetchPairingDetailsIfNeeded = createAsyncThunk('pairing/fetchDetails', async (_, { getState }) => {
  const state = getState() as RootState

  const ids = [state.pairing.father?.id, state.pairing.mother?.id].filter(Boolean).join(',')
  const response = await axiosClient.get(`/birds/by-ids?ids=${ids}`)
  return response.data
})
