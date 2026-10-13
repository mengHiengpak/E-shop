import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import toast from '../../config/toast'
import { useState } from 'react'
import type { ApiEnvelope, Category } from '../../types'

export const useCategory = () => {
  const [isLoading, setIsLoading] = useState(true)

  const category = async (): Promise<Category[]> => {
    setIsLoading(true)
    try {
      const res = await api.get<ApiEnvelope<Category[]> | Category[]>('/categories', {
        params: { limit: 1000 },
      })
      const payload = res.data
      if (Array.isArray(payload)) return payload
      if (Array.isArray(payload?.data)) return payload.data
      if (Array.isArray(payload?.result)) return payload.result
      return []
    } catch (error) {
      toast.error(getErrorMessage(error))
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    category,
  }
}
