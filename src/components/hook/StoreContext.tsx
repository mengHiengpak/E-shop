import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import useCurrent from './Auth/useCurrent'
import type { CartItem, CustomerStore } from '../../types'

interface StoreContextValue {
  products: CartItem[]
  total: number
  isLoading: boolean
  refresh: () => Promise<void>
}

const StoreContext = createContext<StoreContextValue>({
  products: [],
  total: 0,
  isLoading: false,
  refresh: async () => {},
})

export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: customer } = useCurrent()
  const [products, setProducts] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const customerId = customer?._id

  const refresh = useCallback(async (): Promise<void> => {
    if (!customerId) {
      setProducts([])
      return
    }
    setIsLoading(true)
    try {
      const res = await api.get(`/customerstore/customer/${customerId}`)
      const data = (res.data?.result ?? res.data) as CustomerStore | null
      setProducts(data?.products || [])
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404 || status === 400) {
        setProducts([])
      } else {
        console.error(getErrorMessage(err))
      }
    } finally {
      setIsLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const total = products.reduce(
    (sum, item) =>
      sum +
      Number(item.uniPrice ?? item.unitPrice ?? 0) *
        Number(item.quantity ?? item.purchasedQuantity ?? 1),
    0
  )

  return (
    <StoreContext.Provider value={{ products, total, isLoading, refresh }}>
      {children}
    </StoreContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useStore(): StoreContextValue {
  return useContext(StoreContext)
}
