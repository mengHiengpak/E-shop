import Constants from 'expo-constants'

const PROD_API = 'https://e-shop-back-end-vpfq.onrender.com/api'

// The backend dev server runs on the same machine as Metro.
const DEV_BACKEND_PORT = 3000

const envApi = (process.env.EXPO_PUBLIC_URL_BASE ?? '').trim()

const isLocalApi = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?/i.test(envApi)

// React Native has no "built bundle" mode like Vite; __DEV__ is true only while
// running through the Metro dev server. Outside of dev we always fall back to
// the hosted API unless a non-local URL was explicitly configured.
const isDev: boolean = typeof __DEV__ !== 'undefined' ? __DEV__ : false

function isPrivateHost(host: string): boolean {
  return (
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host)
  )
}

// The dev machine's LAN IP can change between sessions (DHCP), which silently
// breaks a hardcoded .env URL. Derive the host from the Metro server that served
// this bundle instead, so the API always follows whichever machine is running
// Expo. Tunnels and hostnames cannot expose the backend port, so only private
// LAN addresses are used.
function devServerApi(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | null)?.debuggerHost ??
    ''
  const host = hostUri.split('/')[0].split('?')[0].split(':')[0]
  if (!host || !isPrivateHost(host)) return null
  return `http://${host}:${DEV_BACKEND_PORT}/api`
}

const derivedApi = isDev ? devServerApi() : null

const apiUrlBase: string = isDev
  ? derivedApi ?? (envApi || PROD_API)
  : isLocalApi || !envApi
    ? PROD_API
    : envApi

export { apiUrlBase }
