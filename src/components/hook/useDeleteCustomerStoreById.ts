import { useState } from 'react'
import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import toast from '../../config/toast'

export const useDeleteCustomerStoreById = () => {
  const [loading, setLoading] = useState(false)

  const remove = async (id?: string): Promise<unknown> => {
    if (!id) return null
    setLoading(true)
    try {
      const res = await api.delete(`/customerstore/${id}`)
      toast.success(res?.data?.message || 'Item removed successfully!')
      return res.data
    } catch (error) {
      toast.error(getErrorMessage(error))
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    remove,
    loading,
  }
}
