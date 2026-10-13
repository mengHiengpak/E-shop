import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colorScheme } from 'nativewind'

export type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_KEY = 'theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  const applyTheme = useCallback((next: Theme) => {
    setThemeState(next)
    colorScheme.set(next)
    AsyncStorage.setItem(THEME_KEY, next).catch(() => {})
  }, [])

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        const next: Theme = saved === 'dark' ? 'dark' : 'light'
        setThemeState(next)
        colorScheme.set(next)
      })
      .catch(() => {})
  }, [])

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark')
  }, [applyTheme, theme])

  return (
    <ThemeContext.Provider
      value={{ theme, isDark: theme === 'dark', setTheme: applyTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
