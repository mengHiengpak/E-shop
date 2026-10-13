import { useEffect } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../hook/LanguageContext'
import useCurrent from '../hook/Auth/useCurrent'
import type { AppNavigation } from '../../navigation/types'

function Wallets() {
  const { t } = useLanguage()
  const { data: customer, refetch: fetchData } = useCurrent()
  const navigation = useNavigation<AppNavigation>()

  useEffect(() => {
    fetchData().catch(() => {})
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="mb-5 gap-1">
        <Text className="text-xl font-black text-[#1A1D20] dark:text-white">{t('wallet_payment')}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{t('manage_balance')}</Text>
      </View>

      <View className="gap-4">
        <View className="overflow-hidden rounded-2xl bg-orange-600 p-5 shadow-md">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-orange-100">
            {t('available_balance')}
          </Text>
          <Text className="mt-1 text-4xl font-black tracking-tight text-white">
            {`៛ ${customer?.walletBalance || 0}`}
          </Text>
          <View className="mt-4 flex-row items-end justify-between border-t border-white/20 pt-4">
            <View className="flex-row items-center gap-2.5">
              <View className="rounded-lg bg-white/20 p-2">
                <Ionicons name="star" size={16} color="#ffffff" />
              </View>
              <View>
                <Text className="text-[10px] font-bold uppercase tracking-wider text-orange-100">
                  {t('reward_points')}
                </Text>
                <Text className="text-sm font-black text-white">1,240 pts</Text>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate('WelletMethod')}
              className="rounded-full bg-white dark:bg-[#111827] px-4 py-2 active:opacity-80"
            >
              <Text className="text-sm font-bold text-orange-600">{t('add_funds')}</Text>
            </Pressable>
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm">
          <View className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] px-5 py-3.5">
            <Text className="text-sm text-[#1A1D20] dark:text-white">{t('saved_payment')}</Text>
          </View>
          <View>
            {(customer?.wallet || [])
              .filter((item) => item?.status === 'paid')
              .map((item, index) => (
                <View
                  key={item?._id || index}
                  className="flex-row items-center justify-between px-5 py-3.5"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="rounded-lg bg-red-50 dark:bg-red-950/40 p-2">
                      <Ionicons name="card" size={18} color="#dc2626" />
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-gray-900 dark:text-white">
                        {item?.fromAccountId || 'null'}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Expires 12/28</Text>
                    </View>
                  </View>
                  <Text className="rounded-full bg-orange-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {t('default_label')}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        <Pressable
          onPress={() => navigation.navigate('WelletMethod')}
          className="flex-row items-center justify-center gap-1.5 rounded-full border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] py-2 active:opacity-80"
        >
          <Ionicons name="add" size={16} color="#4b5563" />
          <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-500">{t('add_new_payment')}</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default Wallets
