import { Pressable, Text, View } from 'react-native'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { useLanguage } from '../hook/LanguageContext'
import type { AppNavigation } from '../../navigation/types'

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface Feature {
  icon: IoniconName
  titleKey: string
  descKey: string
}

const features: Feature[] = [
  { icon: 'headset', titleKey: 'customer_service', descKey: 'customer_service_desc' },
  { icon: 'shield-checkmark', titleKey: 'secure_marketplace', descKey: 'secure_marketplace_desc' },
  { icon: 'cube', titleKey: 'free_shipping', descKey: 'free_shipping_desc' },
  { icon: 'refresh', titleKey: 'easy_returns', descKey: 'easy_returns_desc' },
]

function Hero() {
  const navigation = useNavigation<AppNavigation>()
  const { t } = useLanguage()

  return (
    <View>
      <View className="bg-orange-50 dark:bg-[#0b1220] px-4 py-8">
        <View className="gap-8">
          <View className="gap-6">
            <View className="flex-row items-center gap-2 self-start rounded-full border border-orange-100 bg-white dark:bg-[#111827] px-4 py-1.5">
              <View className="h-2 w-2 rounded-full bg-orange-500" />
              <Text className="text-sm font-medium text-orange-600">{t('hero_badge')}</Text>
            </View>

            <View className="gap-4">
              <Text className="text-4xl font-black leading-tight text-[#1A1D20] dark:text-white">
                {t('hero_title_1')}{' '}
                <Text className="text-orange-600">{t('hero_title_2')}</Text>
              </Text>
              <Text className="text-base leading-relaxed text-gray-600 dark:text-gray-400">{t('hero_desc')}</Text>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={() => navigation.navigate('Products')}
                className="items-center rounded-full bg-orange-600 px-6 py-4 active:opacity-80"
              >
                <Text className="font-bold text-white">{t('shop_now')}</Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('Products')}
                className="items-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] px-6 py-4 active:opacity-80"
              >
                <Text className="font-bold text-gray-700 dark:text-gray-300">{t('view_deals')}</Text>
              </Pressable>
            </View>

            <View className="flex-row items-start gap-6 border-t border-gray-200 dark:border-gray-800 pt-8">
              <View>
                <Text className="text-2xl font-black text-[#1A1D20] dark:text-white">100+</Text>
                <Text numberOfLines={1} className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('products_label')}
                </Text>
              </View>
              <View>
                <View className="flex-row items-center gap-1">
                  <Text className="text-2xl font-black text-[#1A1D20] dark:text-white">4.9</Text>
                  <Ionicons name="star" size={14} color="#facc15" />
                </View>
                <Text numberOfLines={1} className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('avg_rating')}
                </Text>
              </View>
              <View>
                <Text className="text-2xl font-black text-[#1A1D20] dark:text-white">1K+</Text>
                <Text numberOfLines={1} className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('customers_label')}
                </Text>
              </View>
            </View>
          </View>

          <View>
            <View className="overflow-hidden rounded-3xl">
              <Image
                source={require('../../assets/poster.avif')}
                style={{ width: '100%', height: 256 }}
                contentFit="cover"
                transition={300}
              />
            </View>
            <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-4 shadow">
              <View className="rounded-lg bg-yellow-100 dark:bg-yellow-900/40 p-2">
                <Ionicons name="star" size={20} color="#eab308" />
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-900 dark:text-white">{t('hero_rating')}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">{t('hero_reviews')}</Text>
              </View>
            </View>
            <View className="mt-3 flex-row items-center gap-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-4 shadow">
              <View className="rounded-lg bg-green-100 dark:bg-green-900/40 p-2">
                <Ionicons name="checkmark" size={20} color="#16a34a" />
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-900 dark:text-white">{t('hero_free_shipping')}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">{t('hero_free_shipping_desc')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0b1220] px-4 py-8">
        <View className="gap-4">
          {features.map((item) => (
            <View
              key={item.titleKey}
              className="flex-row items-center gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-4 shadow-sm"
            >
              <View className="rounded-xl bg-red-50 dark:bg-red-900/40 p-3">
                <Ionicons name={item.icon} size={22} color="#dc2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 dark:text-white">{t(item.titleKey)}</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">{t(item.descKey)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

export default Hero
