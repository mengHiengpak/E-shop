import { Pressable, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../hook/LanguageContext'
import type { AppNavigation } from '../../navigation/types'

function Banner() {
  const { t } = useLanguage()
  const navigation = useNavigation<AppNavigation>()

  return (
    <View className="mb-8 flex-col gap-4 px-4">
      <View className="overflow-hidden rounded-3xl bg-orange-600 px-6 py-6 shadow-lg">
        <View className="items-center gap-6">
          <View className="items-center">
            <View className="mb-4 flex-row items-center gap-2 self-center rounded-full bg-white/20 px-3 py-1">
              <Ionicons name="car" size={12} color="#ffffff" />
              <Text className="text-xs font-bold uppercase tracking-wider text-white">
                {t('limited_time')}
              </Text>
            </View>
            <Text className="mb-2 text-center text-xl font-black leading-tight text-white">
              {t('free_shipping_title')}{' '}
              <Text className="text-orange-100">{t('free_shipping_subtitle')}</Text>
            </Text>
            <Pressable onPress={() => navigation.navigate('Products')} className="mt-6">
              <Text className="font-medium text-white underline">{t('shop_now_link')}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="overflow-hidden rounded-3xl bg-[#1A1D20] px-6 py-6 shadow-lg">
        <View className="items-center gap-6">
          <View className="items-center">
            <View className="mb-4 flex-row items-center gap-2 self-center rounded-full bg-orange-600 px-3 py-1">
              <Ionicons name="pricetag" size={12} color="#ffffff" />
              <Text className="text-xs font-bold uppercase tracking-wider text-white">
                {t('clearance_event')}
              </Text>
            </View>
            <Text className="mb-2 text-center text-xl font-black leading-tight text-white">
              {t('black_friday')}{' '}
              <Text className="text-orange-500">{t('black_friday_discount')}</Text>
            </Text>
            <Pressable onPress={() => navigation.navigate('Products')} className="mt-6">
              <Text className="font-medium text-white underline">{t('browse_deals')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Banner
