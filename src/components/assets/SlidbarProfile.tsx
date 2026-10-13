import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import type { ComponentProps } from 'react'
import { useLanguage } from '../hook/LanguageContext'
import useSignout from '../hook/Auth/useSignout'
import useCurrent from '../hook/Auth/useCurrent'
import type { AppNavigation } from '../../navigation/types'

type IoniconName = ComponentProps<typeof Ionicons>['name']

type ProfileRoute = 'MyOrder' | 'Wallets' | 'Address' | 'AccountDetail'

interface NavItem {
  labelKey: string
  icon: IoniconName
  to: ProfileRoute
}

const navItems: NavItem[] = [
  { labelKey: 'my_orders', icon: 'bag', to: 'MyOrder' },
  { labelKey: 'wallet', icon: 'card', to: 'Wallets' },
  { labelKey: 'addresses', icon: 'location', to: 'Address' },
  { labelKey: 'account_detail', icon: 'settings', to: 'AccountDetail' },
]

function SlidbarProfile() {
  const { t } = useLanguage()
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
    <View className="p-4">
      <View className="mb-5">
        <Text className="text-3xl font-bold text-black dark:text-white">{t('my_profile')}</Text>
      </View>
      <View className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] p-5 shadow-sm">
        <View className="mb-4 flex-row items-center gap-3 rounded-xl bg-gray-50 dark:bg-[#111827] p-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
            <Text className="text-sm font-bold text-white">
              {String(currentUser?.name || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900 dark:text-white" numberOfLines={1}>
              {currentUser?.name || 'Customer'}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500" numberOfLines={1}>
              {currentUser?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
        <View className="gap-1 border-t border-gray-200 dark:border-gray-800 pt-2">
          {navItems.map((item) => (
            <Pressable
              key={item.to}
              onPress={() => goTo(item.to)}
              className="flex-row items-center gap-3 rounded-lg px-3 py-2.5 active:opacity-80"
            >
              <Ionicons name={item.icon} size={20} color="#4b5563" />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{t(item.labelKey)}</Text>
            </Pressable>
          ))}
        </View>
        <View className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
          <Pressable
            onPress={handleSignOut}
            disabled={isLoading}
            className="flex-row items-center gap-3 rounded-lg px-3 py-2.5 active:opacity-80 disabled:opacity-50"
          >
            <Ionicons name="log-out" size={20} color="#dc2626" />
            <Text className="text-sm font-medium text-red-500">{t('log_out')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default SlidbarProfile
