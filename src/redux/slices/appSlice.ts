import { createSlice } from '@reduxjs/toolkit'

export interface AppState {
  timeZone: string
  reFetch: boolean
  theme: {
    colorPrimary: string
    colorPrimaryBg: string
  }
}
const initialState: AppState = {
  timeZone: '',
  reFetch: false,
  theme: {
    colorPrimary: '#e28048',
    colorPrimaryBg: '#e6f7ff'
  }
}
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    reFetchData: (state) => {
      state.reFetch = !state.reFetch
    }
  }
})

// Action creators are generated for each case reducer function
export const { reFetchData } = appSlice.actions

export const AppReducer = appSlice.reducer
