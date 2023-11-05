import { RcFile } from 'antd/es/upload'

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

export const getBirdImage = (image?: string) => {
  return import.meta.env.VITE_BIRD_URL + `/${image}`
}

export const getUserImage = (image?: string) => {
  return import.meta.env.VITE_USER_URL + `/${image}`
}
