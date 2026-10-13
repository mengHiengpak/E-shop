import { useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import toast from '../../../config/toast'
import type { BakongQr } from '../../../types'

interface VerifyPaymentOptions {
  silent?: boolean
}

interface VerifyPaymentPayload {
  qr_md5?: string
}

export const useBakongPayment = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BakongQr | null>(null)

  const verifyPayment = async (
    id?: string,
    { qr_md5 }: VerifyPaymentPayload = {},
    options: VerifyPaymentOptions = {}
  ): Promise<BakongQr | null> => {
    if (!id || !qr_md5) return null
    setLoading(true)
    try {
      const res = await api.post(`/customers/${id}/add-amount`, { qr_md5 })
      const body = res?.data || {}
      const result = (body.data ?? body.result ?? body) as BakongQr
      setData(result)
      return result
    } catch (error) {
      const msg = getErrorMessage(error)
      if (!options.silent) {
        toast.error(msg)
      }
      console.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    data,
    setData,
    verifyPayment,
  }
}
