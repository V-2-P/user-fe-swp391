import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './reduxHook'
import { addToCompare, removeFromCompare, clearCompare } from '~/redux/slices/compareSlice' // Chỉnh lại đường dẫn tới compareSlice của bạn

export const useCompare = () => {
  const compare = useAppSelector((state) => state.compare)
  const dispatch = useAppDispatch()

  const addProductToCompare = useCallback(
    (product: { id: string; name: string; thumbnail: string }) => {
      dispatch(addToCompare(product))
    },
    [dispatch]
  )

  const removeProductFromCompare = useCallback(
    (id: string) => {
      dispatch(removeFromCompare(id))
    },
    [dispatch]
  )

  const clearCompareList = useCallback(() => {
    dispatch(clearCompare())
  }, [dispatch])

  const memoizedCompare = useMemo(() => compare, [compare])
  return {
    compare: memoizedCompare,
    addProductToCompare,
    removeProductFromCompare,
    clearCompareList
  }
}
