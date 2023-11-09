import { useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './reduxHook'
import { setImageUrl } from '~/redux/slices'

export const useAuth = () => {
  const account = useAppSelector((state) => state.account)
  const dispatch = useAppDispatch()
  const changeImage = useCallback(
    async (url: string) => {
      await dispatch(setImageUrl(url))
    },
    [dispatch]
  )
  const memoizedAccount = useMemo(() => account, [account])
  return {
    account: memoizedAccount,
    changeImage
  }
}
