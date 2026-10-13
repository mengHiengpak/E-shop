import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { useLanguage } from '../components/hook/LanguageContext'
import useSignout from '../components/hook/Auth/useSignout'
import useCurrent from '../components/hook/Auth/useCurrent'
import type { AppNavigation } from '../navigation/types'

type IoniconName = ComponentProps<typeof Ionicons>['name']

type ProfileRoute = 'MyOrder' | 'Wallets' | 'Address' | 'AccountDetail'

interface AccountTab {
  labelKey: string
  icon: IoniconName
  to: ProfileRoute
}

const accountTabs: AccountTab[] = [
  { labelKey: 'my_orders', icon: 'bag', to: 'MyOrder' },
  { labelKey: 'wallet', icon: 'card', to: 'Wallets' },
  { labelKey: 'addresses', icon: 'location', to: 'Address' },
  { labelKey: 'account_detail', icon: 'settings', to: 'AccountDetail' },
]

function Account() {
  const { t, language, setLanguage } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const { data: currentUser } = useCurrent()
  const { isLoading, signOut } = useSignout()
  const navigation = useNavigation<AppNavigation>()

  const goTo = (route: ProfileRoute): void => {
    switch (route) {
      case 'MyOrder':
        navigation.navigate('MyOrder')
        break
      case 'Wallets':
        navigation.navigate('Wallets')
        break
      case 'Address':
        navigation.navigate('Address')
        break
      case 'AccountDetail':
        navigation.navigate('AccountDetail')
        break
    }
  }

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingTop: 24, paddingHorizontal: 16, paddingBottom: 120 }}
    >
      <View className="mb-6">
        <Text className="text-3xl font-black text-black dark:text-white">{t('my_profile')}</Text>
      </View>

      <View className="mb-5 flex-row items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] p-3">
        <View className="items-center justify-center rounded-full bg-indigo-600 px-3 py-2">
          <Text className="text-sm font-bold text-white">
            {String(currentUser?.name || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
            {currentUser?.name || 'Customer'}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400" numberOfLines={1}>
            {currentUser?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      <View className="gap-1">
        {accountTabs.map((tab) => (
          <Pressable
            key={tab.to}
            onPress={() => goTo(tab.to)}
            className="flex-row items-center gap-3 rounded-lg px-3 py-2.5 active:opacity-80"
          >
            <Ionicons name={tab.icon} size={20} color="#4b5563" />
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{t(tab.labelKey)}</Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] p-3">
        <View className="mb-3 flex-row items-center gap-2">
          <Ionicons name="language" size={18} color="#4b5563" />
          <Text className="text-sm font-semibold text-gray-900 dark:text-white">{t('language_label')}</Text>
        </View>

        <Pressable
          onPress={() => setLangOpen((open) => !open)}
          className="flex-row items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] px-3 py-2.5 active:opacity-80"
        >
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {language === 'en' ? t('language_english') : t('language_khmer')}
          </Text>
          <Ionicons name={langOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#6b7280" />
        </Pressable>

        {langOpen ? (
          <View className="mt-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]">
            <Pressable
              onPress={() => {
                setLanguage('en')
                setLangOpen(false)
              }}
              className={`flex-row items-center justify-between px-3 py-2.5 active:opacity-80 ${
                language === 'en' ? 'bg-orange-50' : ''
              }`}
            >
              <Text
                className={`text-sm ${language === 'en' ? 'font-bold text-orange-600' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {t('language_english')}
              </Text>
              {language === 'en' ? <Ionicons name="checkmark" size={16} color="#ea580c" /> : null}
            </Pressable>
            <View className="h-px bg-gray-100 dark:bg-gray-800" />
            <Pressable
              onPress={() => {
                setLanguage('kh')
                setLangOpen(false)
              }}
              className={`flex-row items-center justify-between px-3 py-2.5 active:opacity-80 ${
                language === 'kh' ? 'bg-orange-50' : ''
              }`}
            >
              <Text
                className={`text-sm ${language === 'kh' ? 'font-bold text-orange-600' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {t('language_khmer')}
              </Text>
              {language === 'kh' ? <Ionicons name="checkmark" size={16} color="#ea580c" /> : null}
            </Pressable>
          </View>
        ) : null}
      </View>

      <Pressable
        onPress={handleSignOut}
        disabled={isLoading}
        className="mt-6 flex-row items-center gap-3 rounded-lg px-3 py-2.5 active:opacity-80 disabled:opacity-50"
      >
        <Ionicons name="log-out" size={20} color="#dc2626" />
        <Text className="text-sm font-medium text-red-500">{t('log_out')}</Text>
      </Pressable>
    </ScrollView>
  )
}

export default Account
