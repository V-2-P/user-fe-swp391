import React, { ReactNode, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Home, NotFound } from '~/application/pages'
import Loading from '../components/shared/Loading'
import ErrorBoundary from './errorBoundary'
import ProductDetail from '../pages/ProductDetail'
import Information from '../pages/ProductDetail/information'
import Profile from '../pages/UserProfile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { ShoppingCart } from '../pages/ShoppingCart'

import ProductList from '../pages/ProductList'

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
            <Route path='/' element={<Home />} />
            <Route path='/productDetail' element={<ProductDetail />} />
            <Route path='/test' element={<Information />} />
            <Route path='/userprofile' element={<Profile />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/shoppingcart' element={<ShoppingCart />} />

            <Route path='/productlist' element={<ProductList />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Wrapper>
  )
}

export default Router
