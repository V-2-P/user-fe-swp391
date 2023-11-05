import axiosClient from '../AxiosClient'
import { LoginPayload } from './types'

const APIs_URL = {
  LOGIN: '/auth/signin',
  REFRESH_TOKEN: '/auth/refresh'
}

export const loginAPI = async (data: LoginPayload) => {
  return await axiosClient.post(APIs_URL.LOGIN, data)
}

export const refreshAccessToken = async () => {
  return await axiosClient.post(APIs_URL.REFRESH_TOKEN)
}
