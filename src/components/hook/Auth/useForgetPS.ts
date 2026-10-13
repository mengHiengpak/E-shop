import { useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import toast from '../../../config/toast'

export interface ForgetPSInput {
  email: string
  password: string
  confirmPassword: string
}

interface ForgetPSResponse {
  success?: boolean
  message?: string
}

export const useForgetPS = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const forgetPS = async (input: ForgetPSInput): Promise<ForgetPSResponse> => {
    const { email, password, confirmPassword } = input
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setIsLoading(false)
      const msg = 'Passwords do not match'
      setError(msg)
      toast.error(msg)
      throw new Error(msg)
    }

    try {
      const res = await api.patch<ForgetPSResponse>('/customer/email', { email, password })
      toast.success(res?.data?.message || 'Password updated successfully')
      return res.data
    } catch (err) {
      const msg = getErrorMessage(err, 'server is error')
      setError(msg)
      toast.error(msg)
      console.error(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, forgetPS }
}
