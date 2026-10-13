import { useContext, useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import { setToken } from '../../../config/token'
import { AuthContext } from './AuthContext'
import toast from '../../../config/toast'

interface SigninResponse {
  success?: boolean
  message?: string
  result?: { token?: string }
}

export const useSignin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { refetch } = useContext(AuthContext)

  const signin = async (email: string, password: string): Promise<SigninResponse> => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.post<SigninResponse>('/customer/signin', { email, password })
      await setToken(res?.data?.result?.token ?? '')
      toast.success(res?.data?.message || 'Signed in successfully!')
      await refetch()
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
    signin,
  }
}
