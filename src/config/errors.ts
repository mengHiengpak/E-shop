import type { AxiosError } from 'axios'
import type { ApiEnvelope } from '../types'

export const SERVER_ERROR = 'server is error!'

// Normalises the many different error shapes the backend can return into a
// single human readable string.
export function getErrorMessage(error: unknown, fallback: string = SERVER_ERROR): string {
  if (error && typeof error === 'object') {
    const axiosError = error as AxiosError<ApiEnvelope<unknown>>
    const data = axiosError.response?.data
    if (data?.error) return data.error
    if (data?.message) return data.message
    if (axiosError.message) return axiosError.message
  }
  return fallback
}
