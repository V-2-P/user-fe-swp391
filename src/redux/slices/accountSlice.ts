import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosClient from '~/utils/api/AxiosClient'

export interface AccountState {
  isLogin: boolean
  error: any
  isLoading: boolean
  accessToken?: string
  userId?: number
  role?: string
}
// Tạo một async thunk cho đăng ký
export const loginAsync = createAsyncThunk('auth/signin', async (userData: any, { rejectWithValue }) => {
  try {
    // Gọi API đăng ký ở đây và trả về dữ liệu đã đăng ký
    const response = await axiosClient.post('/auth/signin', userData)
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
    logout: (state) => {
      state.isLogin = false
      state.error = null
      state.isLoading = false
      localStorage.clear()
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.isLogin = true
        state.accessToken = action.payload.accessToken
        state.userId = action.payload.userId
        state.role = action.payload.role
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
export const { logout } = accountSlice.actions

export const AccountReducer = accountSlice.reducer
