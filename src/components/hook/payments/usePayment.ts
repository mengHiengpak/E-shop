import { useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import toast from '../../../config/toast'

interface PaymentPayload {
  paidAmount?: number | string
  painAmount?: number | string
}

interface PaymentResult {
  success?: boolean
  message?: string
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false)

  const payment = async (id?: string, data: PaymentPayload = {}): Promise<PaymentResult | null> => {
    if (!id) return null
    const paidAmount = Number(data?.paidAmount ?? data?.painAmount)
    if (!paidAmount || Number.isNaN(paidAmount) || paidAmount <= 0) {
      toast.error('Please provide a valid paidAmount greater than 0!')
      return null
    }
    setLoading(true)
    try {
      const res = await api.post(`/customerstore/payment/${id}`, { paidAmount })
      const body = res?.data || {}
      const result = (body.data ?? body.result ?? body) as PaymentResult
      if (result?.success) {
        toast.success(result?.message || body?.message || 'Payment successful!')
      }
      return result
    } catch (error) {
      toast.error(getErrorMessage(error))
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    payment,
  }
}
