import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import type { Customer } from '../../../types'

interface UseCurrentResult {
  isLoading: boolean
  data: Customer | null
  refetch: () => Promise<Customer | null>
}

function useCurrent(): UseCurrentResult {
  const { user, isLoading, refetch } = useContext(AuthContext)

  return {
    isLoading,
    data: user,
    refetch,
  }
}

export default useCurrent
