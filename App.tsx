import 'react-native-gesture-handler'
import './global.css'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { LanguageProvider } from './src/components/hook/LanguageContext'
import { ThemeProvider } from './src/components/hook/ThemeContext'
import { AuthProvider } from './src/components/hook/Auth/AuthContext'
import { StoreProvider } from './src/components/hook/StoreContext'
import RootNavigator from './src/navigation/RootNavigator'
import { loadToken } from './src/config/token'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadToken().finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <StoreProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
              <StatusBar style="auto" />
              <Toast />
            </StoreProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
