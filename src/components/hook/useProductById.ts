import { useCallback, useEffect, useState } from 'react'
import { api } from '../../config/app'
import { getErrorMessage } from '../../config/errors'
import toast from '../../config/toast'
import type { ProductDetailResponse } from '../../types'

export const useProductById = (collection: string, id?: string) => {
  const [products, setProducts] = useState<ProductDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (): Promise<void> => {
    if (!id || !collection) return
    try {
      const res = await api.get<ProductDetailResponse>(`/${collection}/${id}`)
      setProducts(res.data)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [id, collection])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = async (): Promise<void> => {
    setLoading(true)
    await fetchData()
  }

  return {
    products,
    loading,
    refetch,
  }
}
