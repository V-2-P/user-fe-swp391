import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { cacher } from '~/utils/rtkQueryCacheUtils'

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

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.techx.id.vn/api/v1' }),
  tagTypes: [...cacher.defaultTags, 'Cart'],
  endpoints: (builder) => ({
    getProductDetails: builder.query<Bird[], string>({
      query: (id) => `birds/by-ids?ids=${id}`,
      keepUnusedDataFor: 1800,
      transformResponse: (response: { code: number; message: string; data: Bird[] }) => {
        return response.data
      },
      providesTags: cacher.providesList('Cart')
    })
  })
})

export const { useGetProductDetailsQuery } = productApi
