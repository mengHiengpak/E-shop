import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api } from '../../../config/app'
import { getErrorMessage } from '../../../config/errors'
import { on } from '../../../config/events'
import type { ApiEnvelope, Customer } from '../../../types'

export interface AuthContextValue {
  user: Customer | null
  isLoading: boolean
  refetch: () => Promise<Customer | null>
  setUser: (user: Customer | null) => void
  clearUser: () => void
}

const defaultAuthValue: AuthContextValue = {
  user: null,
  isLoading: true,
  refetch: async () => null,
  setUser: () => {},
  clearUser: () => {},
}

// oxlint-disable-next-line react/only-export-components
export const AuthContext = createContext<AuthContextValue>(defaultAuthValue)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refetch = useCallback(async (): Promise<Customer | null> => {
    try {
      const res = await api.get<ApiEnvelope<Customer>>('/customer/me')
      const currentUser = res.data?.success ? res.data.result ?? null : null
      setUser(currentUser)
      return currentUser
    } catch (error) {
      console.log(getErrorMessage(error))
      setUser(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearUser = useCallback(() => {
    setUser(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const offUnauthorized = on('auth:unauthorized', clearUser)
    return offUnauthorized
  }, [clearUser])

  useEffect(() => {
    refetch()
  }, [refetch])

  const value = useMemo(
    () => ({ user, isLoading, refetch, setUser, clearUser }),
    [user, isLoading, refetch, clearUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
