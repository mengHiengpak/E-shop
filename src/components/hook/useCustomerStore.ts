import { useEffect, useState } from 'react'
import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import toast from '../../config/toast'
import type { CustomerStore } from '../../types'

interface CustomerStoreResponse extends CustomerStore {
  result?: CustomerStore
}

export const useCustomerStore = (customerId?: string) => {
  const [data, setData] = useState<CustomerStore | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStore = async (id?: string): Promise<void> => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.get<CustomerStoreResponse>(`/customerstore/customer/${id}`)
      setData(res.data?.result ?? res.data)
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 404 || status === 400) {
        setData(null)
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

  useEffect(() => {
    fetchStore(customerId)
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId])

  return {
    data,
    isLoading,
    error,
    refetch: () => fetchStore(customerId),
  }
}
