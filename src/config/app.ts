import axios, { type InternalAxiosRequestConfig } from 'axios'
import { apiUrlBase } from './env'
import { getToken, setToken } from './token'
import { emit } from './events'

export const api = axios.create({
  baseURL: `${apiUrlBase}`,
})

// The API reads the JWT from a `token` request header. React Native has no
// cookie jar, so the header is the only way to authenticate a request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.set('token', token)
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (getToken()) {
        setToken('')
        emit('auth:unauthorized')
      }
    }
    return Promise.reject(error)
  }
)
