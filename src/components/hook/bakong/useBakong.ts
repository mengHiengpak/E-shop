import { useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import toast from '../../../config/toast'
import type { BakongQr } from '../../../types'

interface GenerateQrOptions {
  amount?: number | string
}

export const useBakong = () => {
  const [loading, setLoading] = useState(false)
  const [qrData, setQrData] = useState<BakongQr | null>(null)

  const generateQr = async (id?: string, options: GenerateQrOptions = {}): Promise<BakongQr | null> => {
    const { amount } = options
    if (!id || !(Number(amount) > 0)) return null
    setLoading(true)
    setQrData(null)
    try {
      const res = await api.post(`/customers/${id}/generate-khqr`, { amount })
      const body = res?.data || {}
      const result = (body.data ?? body.result ?? body) as BakongQr
      if (!result?.qr_code || !result?.qr_md5) {
        toast.error(result?.message || body?.message || 'QR generation failed!')
        return null
      }
      setQrData(result)
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
    qrData,
    setQrData,
    generateQr,
  }
}
