import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Role, LoginPayload, loginAPI, LoginResponse } from '~/utils/api/auth'

export interface AccountState {
  isLogin: boolean
  error: any
  isLoading: boolean
  accessToken?: string
  refreshToken?: string
  userId?: number
  role?: Role
  imageUrl?: string
}

export const loginAsync = createAsyncThunk('auth/signin', async (userData: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await loginAPI(userData)
    return response.data
  } catch (error) {
    return rejectWithValue(error)
  }
})

const initialState: AccountState = {
  isLogin: false,
  error: null,
  isLoading: false
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    logout: () => {
      return initialState
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false
        state.isLogin = true
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.userId = action.payload.userId
        state.role = action.payload.role
        state.imageUrl = action.payload.imageUrl
      })
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true
        state.isLogin = false
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isLogin = false
        state.error = action.payload
      })
  }
})

// Action creators are generated for each case reducer function
export const { logout, setAccessToken } = accountSlice.actions

export const AccountReducer = accountSlice.reducer
