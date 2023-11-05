import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '~/application/hooks/reduxHook'

type PrivateRouteProps = {
  redirectPath?: string
  children?: React.ReactNode
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectPath = '/login', children }) => {
  const { isLogin } = useAppSelector((state) => state.account)
  if (!isLogin) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}

export default PrivateRoute
