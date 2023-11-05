import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import logger from 'redux-logger'
import { batchedSubscribe } from 'redux-batched-subscribe'

import { debounce } from 'lodash'
import storage from 'redux-persist/lib/storage'
import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import { AppReducer, AccountReducer, CartReducer, productApi, CompareReducer } from './slices'

const debounceNotify = debounce((notify: any) => notify())

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  blacklist: []
}

const reducers = combineReducers({
  app: AppReducer,
  account: AccountReducer,
  cart: CartReducer,
  compare: CompareReducer,
  [productApi.reducerPath]: productApi.reducer
})

const rootReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk).concat(logger).concat(productApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [batchedSubscribe(debounceNotify)]
})
setupListeners(store.dispatch)
export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reducers>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
