import React, { ReactNode, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Landing, NotFound } from '~/application/pages'
import Loading from '../components/shared/Loading'
import ErrorBoundary from './errorBoundary'
import ProductDetail from '../pages/ProductDetail'
import Information from '../pages/ProductDetail/information'
import Profile from '../pages/UserProfile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { ShoppingCart } from '../pages/ShoppingCart'

import ProductList from '../pages/ProductList'
import CommonLayout from '../layouts/common'
import { ViewAllBird } from '../pages/ProductList/allBird'
import Checkout from '../pages/Checkout'
import { VerifyPage } from '../pages/Verify'
import { ComparePage } from '../pages/Compare'
import CompareLayout from '../layouts/compareLayout'
import { Order } from '../pages/Order'

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
            <Route element={<CommonLayout />}>
              <Route path='/' element={<Landing />} />
              <Route element={<CompareLayout />}>
                <Route path='/productdetail/:id' element={<ProductDetail />} />
                <Route path='/compare' element={<ComparePage />} />
                <Route path='/viewall' element={<ViewAllBird />} />
                <Route path='/productlist' element={<ProductList />} />
                <Route path='/shoppingcart' element={<ShoppingCart />} />
              </Route>
              <Route path='/test' element={<Information />} />
              <Route path='/userprofile' element={<Profile />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/verify' element={<VerifyPage />} />
              <Route path='/order' element={<Order />} />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default Router
