export const OAUTH2_REDIRECT_URI = 'https://birdfarmshop.techx.id.vn'

export const GOOGLE_AUTH_URL = 'https://api.techx.id.vn/oauth2/authorize/google?redirect_uri=' + OAUTH2_REDIRECT_URI
export const FACEBOOK_AUTH_URL = 'https://api.techx.id.vn/oauth2/authorize/facebook?redirect_uri=' + OAUTH2_REDIRECT_URI

export enum OrderStatus {
  pending = 'pending',
  delivered = 'delivered',
  cancelled = 'cancelled',
  processing = 'processing',
  shipping = 'shipping'
}
