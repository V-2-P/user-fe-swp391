import React, { ReactNode, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import {
  Landing,
  NotFound,
  Login,
  Profile,
  ProductDetail,
  Register,
  ShoppingCart,
  ViewAllBird,
  Checkout,
  VerifyPage,
  ComparePage,
  OrderPage,
  ProductList,
  Pairing,
  PairingCheckout,
  ForgotPassword,
  ChangePassword,
  OrderDetail,
  Booking,
  BookingDetail
} from '~/application/pages'
import Loading from '../components/shared/Loading'
import ErrorBoundary from './errorBoundary'
import CommonLayout from '../layouts/common'
import CompareLayout from '../layouts/compareLayout'
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
                <Route path='/forgotpassword' element={<ForgotPassword />} />
                <Route path='/changePassword' element={<ChangePassword />} />
              </Route>

              <Route element={<CompareLayout />}>
                <Route path='/productdetail/:id' element={<ProductDetail />} />

                <Route path='/shoppingcart' element={<ShoppingCart />} />
              </Route>
              <Route element={<PrivateRoute />}>
                <Route path='/order' element={<OrderPage />} />
                <Route path='/booking' element={<Booking />} />
                <Route path='/orderdetail/:id' element={<OrderDetail />} />
                <Route path='/bookingdetail/:id' element={<BookingDetail />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/userprofile' element={<Profile />} />

                <Route path='/pairingcheckout' element={<PairingCheckout />} />
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
