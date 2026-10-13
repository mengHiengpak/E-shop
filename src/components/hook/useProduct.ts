import { useCallback, useEffect, useState } from 'react'
import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import toast from '../../config/toast'
import type { ApiEnvelope, Product } from '../../types'

export const useProduct = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<Product[]>([])

  const fetchProducts = useCallback(async (keyword = ''): Promise<void> => {
    setIsLoading(true)
    try {
      const params: { limit: number; search?: string } = { limit: 100 }
      if (keyword) params.search = keyword
      const res = await api.get<ApiEnvelope<Product[]>>('/product', { params })
      setData(Array.isArray(res.data?.result) ? res.data.result : [])
    } catch (err) {
      const msg = getErrorMessage(err, 'Server is error!')
      setError(msg)
      toast.error(msg)
      console.error(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const search = useCallback(
    async (keyword: string): Promise<void> => {
      await fetchProducts(keyword)
    },
    [fetchProducts]
  )

  return {
    isLoading,
    error,
    data,
    search,
  }
}
