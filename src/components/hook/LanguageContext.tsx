import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import translations from '../languages/Languages'
import type { Translate } from '../../types'

export type Language = 'en' | 'kh'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: Translate
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const LANGUAGE_KEY = 'language'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((saved) => {
        if (saved === 'en' || saved === 'kh') setLanguage(saved)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    AsyncStorage.setItem(LANGUAGE_KEY, language).catch(() => {})
  }, [language])

  const t: Translate = (key, vars = {}) => {
    const dictionary = translations[language] ?? translations.en
    let text = dictionary[key] ?? translations.en[key] ?? key
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replace(`{${name}}`, String(value))
    })
    return text
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
