import { useEffect, useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import useCurrent from '../Auth/useCurrent'
import toast from '../../../config/toast'
import type { SaleOrder } from '../../../types'

function extractOrders(payload: unknown): SaleOrder[] {
  if (Array.isArray(payload)) return payload as SaleOrder[]
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    const nested = record.result ?? payload
    if (Array.isArray(nested)) return nested as SaleOrder[]
    if (nested && typeof nested === 'object') {
      const inner = nested as Record<string, unknown>
      for (const key of ['sales', 'orders', 'items', 'products']) {
        if (Array.isArray(inner[key])) return inner[key] as SaleOrder[]
      }
    }
  }
  return []
}

export const useCustomerProduct = () => {
  const { data: customer } = useCurrent()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SaleOrder[]>([])

  useEffect(() => {
    if (!customer?._id) {
      setIsLoading(false)
      return
    }
    const fetchData = async (): Promise<void> => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await api.get(`/sales/customer/${customer._id}`)
        setData(extractOrders(res.data))
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status
        if (status === 404) {
          setData([])
        } else {
          const msg = getErrorMessage(err)
          setError(msg)
          toast.error(msg)
          console.error(msg)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [customer])

  return {
    isLoading,
    error,
    data,
  }
}
