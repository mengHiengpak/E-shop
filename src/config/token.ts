import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN_KEY = 'e_shop_token'

// A synchronous mirror of the persisted token so axios request interceptors can
// read it without awaiting storage on every request.
let memoryToken = ''

export function getToken(): string {
  return memoryToken
}

export async function loadToken(): Promise<string> {
  try {
    memoryToken = (await AsyncStorage.getItem(TOKEN_KEY)) || ''
  } catch {
    memoryToken = ''
  }
  return memoryToken
}

export async function setToken(token: string | null): Promise<void> {
  memoryToken = token || ''
  try {
    if (token) {
      await AsyncStorage.setItem(TOKEN_KEY, token)
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // storage unavailable
  }
}
