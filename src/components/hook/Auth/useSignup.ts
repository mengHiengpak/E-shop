import { api } from '../../../config/app'
import { useState } from 'react'
import { getErrorMessage } from '../../../config/errors'
import toast from '../../../config/toast'

export interface SignupInput {
  phone: string
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface SignupResponse {
  success?: boolean
  message?: string
  result?: unknown
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const signup = async (input: SignupInput): Promise<SignupResponse> => {
    const { phone, name, email, password, confirmPassword } = input
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
      const res = await api.post<SignupResponse>('/customer/signup', {
        phone,
        name,
        email,
        password,
        confirmPassword,
      })
      toast.success(res?.data?.message || 'Account created successfully!')
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

  return {
    isLoading,
    error,
    signup,
  }
}
