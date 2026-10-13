import { useState } from 'react'
import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import toast from '../../config/toast'
import type { CustomerStoreCreateResponse, CustomerStoreInput } from '../../types'

export const useCustomerStoreProduct = () => {
  const [loading, setLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  const sale = async (data: CustomerStoreInput): Promise<CustomerStoreCreateResponse | null> => {
    setLoading(true)
    setRefetch(true)
    try {
      const res = await api.post<CustomerStoreCreateResponse>('/customerstore', data)
      toast.success(res?.data?.message || 'Added to cart successfully!')
      return res.data
    } catch (error) {
      toast.error(getErrorMessage(error))
      return null
    } finally {
      setLoading(false)
      setRefetch(false)
    }
  }

  return {
    sale,
    loading,
    refetch,
  }
}
