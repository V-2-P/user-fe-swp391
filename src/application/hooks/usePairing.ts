import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from './reduxHook'
import { setFather, setMother, clearFather, clearMother, clearPairing } from '~/redux/slices/pairingSlice'
import { fetchPairingDetailsIfNeeded } from '~/redux/slices'

export const usePairing = () => {
  const pairing = useAppSelector((state) => state.pairing)
  const dispatch = useAppDispatch()

  const addFatherToPairing = useCallback(
    async (product: { id: string; name: string; thumbnail: string }) => {
      await dispatch(setFather(product))
      await dispatch(fetchPairingDetailsIfNeeded())
    },
    [dispatch]
  )
  const addMotherToPairing = useCallback(
    async (product: { id: string; name: string; thumbnail: string }) => {
      await dispatch(setMother(product))
      await dispatch(fetchPairingDetailsIfNeeded())
    },
    [dispatch]
  )

  const removeFatherFromPairing = useCallback(() => {
    dispatch(clearFather())
  }, [dispatch])
  const removeMotherFromPairing = useCallback(() => {
    dispatch(clearMother())
  }, [dispatch])

  const clearPairingList = useCallback(() => {
    dispatch(clearPairing())
  }, [dispatch])

  const memoizedPairing = useMemo(() => pairing, [pairing])

  return {
    pairing: memoizedPairing,
    addFatherToPairing,
    addMotherToPairing,
    removeFatherFromPairing,
    removeMotherFromPairing,
    clearPairingList
  }
}
