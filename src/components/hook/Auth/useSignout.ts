import { useContext, useState } from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import { setToken } from '../../../config/token'
import { AuthContext } from './AuthContext'
import toast from '../../../config/toast'

interface SignoutResponse {
  success?: boolean
  message?: string
}

function useSignout() {
  const [isLoading, setIsLoading] = useState(false)
  const { clearUser } = useContext(AuthContext)

  const signOut = async (): Promise<SignoutResponse> => {
    try {
      setIsLoading(true)
      const res = await api.post<SignoutResponse>('/customer/signout')
      await setToken('')
      clearUser()
      toast.success(res?.data?.message || 'Signed out successfully!')
      return res.data
    } catch (error) {
      const msg = getErrorMessage(error)
      console.error(msg)
      toast.error(msg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, signOut }
}

export default useSignout
