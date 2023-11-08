import React, { ReactNode, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Landing, NotFound } from '~/application/pages'
import Loading from '../components/shared/Loading'
import ErrorBoundary from './errorBoundary'
import ProductDetail from '../pages/ProductDetail'
import Profile from '../pages/UserProfile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { ShoppingCart } from '../pages/ShoppingCart'

import ProductList from '../pages/ProductList'
import CommonLayout from '../layouts/common'
import ViewAllBird from '../pages/ProductList/allBird'
import Checkout from '../pages/Checkout'
import { VerifyPage } from '../pages/Verify'
import { ComparePage } from '../pages/Compare'
import CompareLayout from '../layouts/compareLayout'
import { Order } from '../pages/Order'
import Pairing from '../pages/Pairing'
import PublicRoute from '../components/shared/PublicRoute'
import PrivateRoute from '../components/shared/PrivateRoute'
import ShoppingLayout from '../layouts/shoppingLayout'

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation()
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0)
  }, [location.pathname])
  return children
}

const Router: React.FC = () => {
  return (
    <Wrapper>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<ShoppingLayout />}>
              <Route path='/productlist' element={<ProductList />} />
              <Route path='/viewall' element={<ViewAllBird />} />
            </Route>

            <Route element={<CommonLayout />}>
              <Route element={<PublicRoute />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/verify' element={<VerifyPage />} />
              </Route>

              <Route element={<CompareLayout />}>
                <Route path='/productdetail/:id' element={<ProductDetail />} />

                <Route path='/shoppingcart' element={<ShoppingCart />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path='/order' element={<Order />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/userprofile' element={<Profile />} />
              </Route>

              <Route path='/' element={<Landing />} />
              <Route path='/compare' element={<ComparePage />} />
              <Route path='/pairing' element={<Pairing />} />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default Router
