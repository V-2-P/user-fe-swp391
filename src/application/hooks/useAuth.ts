import { useMemo } from 'react'
import { useAppSelector } from './reduxHook'

export const useAuth = () => {
  const account = useAppSelector((state) => state.account)

  const memoizedAccount = useMemo(() => account, [account])
  return {
    account: memoizedAccount
  }
}
