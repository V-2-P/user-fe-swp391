export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  refreshToken: string
  accessToken: string
  userId: number
  role: Role
  imageUrl: string
}

export enum Role {
  ROLE_ADMIN,
  ROLE_MANAGER,
  ROLE_STAFF,
  ROLE_CUSTOMER
}
