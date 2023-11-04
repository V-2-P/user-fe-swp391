import axios, { AxiosInstance } from 'axios'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/application/hooks/reduxHook'
import { setAccessToken, logout } from '~/redux/slices'

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'content-type': 'application/json'
  },
  withCredentials: true
})

const authClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'content-type': 'application/json'
  },
  withCredentials: true
})

type AxiosInterceptorTypes = {
  children: React.ReactNode
}
const AxiosInterceptor: React.FC<AxiosInterceptorTypes> = ({ children }) => {
  const [isSet, setIsSet] = useState(false)
  const dispatch = useAppDispatch()
  const { accessToken } = useAppSelector((state) => state.account)

  useEffect(() => {
    /* Request Interceptor */
    const requestInterceptor = (config: any) => {
      const customHeader = {} as any

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

    const requestErrorInterceptor = (error: any) => Promise.reject(error)

    /* Response Interceptor */
    const responseInterceptor = (response: any) => {
      /**
       * Add logic for successful response
       */
      return response?.data || {}
    }

    const responseErrorInterceptor = async (error: any) => {
      /**
       * Add logic for any error from backend
       */
      const originalRequest = error.config
      if (error.response.data.code === 401 && !originalRequest._retry) {
        try {
          originalRequest._retry = true
          const response = await authClient.post('/auth/refresh')
          dispatch(setAccessToken(response.data.data.accessToken))
          originalRequest.headers['Authorization'] = `Bearer ${response.data.data.accessToken}`
          return axiosClient(originalRequest)
        } catch (e) {
          dispatch(logout())
          if (error.response && error.response.data.message) {
            return Promise.reject(error.response.data.message)
          } else if (error.message) {
            return Promise.reject(error.message)
          } else {
            return Promise.reject('Có lỗi bất ngờ xảy ra !!!')
          }
        }
      }
      if (error.response && error.response.data.message) {
        return Promise.reject(error.response.data.message)
      } else if (error.message) {
        return Promise.reject(error.message)
      } else {
        return Promise.reject('Có lỗi bất ngờ xảy ra !!!')
      }
    }

    const interceptorReq = axiosClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
    const interceptorRes = axiosClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
    setIsSet(true)
    return () => {
      axiosClient.interceptors.request.eject(interceptorReq)
      axiosClient.interceptors.response.eject(interceptorRes)
    }
  }, [accessToken, dispatch])

  return isSet && children
}

/* Export */
export default axiosClient
export { AxiosInterceptor }
