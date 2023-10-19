import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios'

import { LocalStorageUtils, LOCAL_STORAGE_KEY } from '~/utils/cache/LocalStorage'

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'content-type': 'application/json'
  },
  withCredentials: true
})

/* Request Interceptor */
export const requestInterceptor = async (config: any) => {
  const storage = new LocalStorageUtils()
  const customHeader = {} as AxiosRequestHeaders
  const accessToken = storage.getItem<string>(LOCAL_STORAGE_KEY.JWT)

  if (accessToken) {
    customHeader.Authorization = `Bearer ${accessToken}`
  }
  return {
    ...config,
    headers: {
      ...customHeader,
      ...config.headers
    }
  }
}
export const requestErrorInterceptor = (error: any) => Promise.reject(error)
axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

/* Response Interceptor */
export const responseInterceptor = (response: any) => {
  /**
   * Add logic for successful response
   */
  return response?.data || {}
}
export const responseErrorInterceptor = async (error: any) => {
  /**
   * Add logic for any error from backend
   */
  const originalRequest = error.config
  if (error.response.data.code === 401 && !originalRequest._retry) {
    originalRequest._retry = true

    const response = await axiosClient.post('/auth/refresh')

    const { accessToken } = response.data
    const storage = new LocalStorageUtils()
    storage.setItem(LOCAL_STORAGE_KEY.JWT, accessToken)
    originalRequest.headers.Authorization = `Bearer ${accessToken}`

    return axiosClient(originalRequest)
  }

  if (error.response && error.response.data.message) {
    return Promise.reject(error.response.data.message)
  } else if (error.message) {
    return Promise.reject(error.message)
  } else {
    return Promise.reject('Có lỗi bất ngờ xảy ra !!!')
  }
}
axiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

/* Export */
export default axiosClient
