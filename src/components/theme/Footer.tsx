import { Pressable, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import { useLanguage } from '../hook/LanguageContext'
import type { AppNavigation } from '../../navigation/types'

type FooterLink = 'products' | 'contact' | 'home'
type IoniconName = ComponentProps<typeof Ionicons>['name']

const socialIcons: IoniconName[] = [
  'logo-facebook',
  'logo-twitter',
  'logo-instagram',
  'logo-youtube',
]

function Footer() {
  const { t } = useLanguage()
  const navigation = useNavigation<AppNavigation>()

  const linkPress = (to: FooterLink): void => {
    if (to === 'products') navigation.navigate('Tabs', { screen: 'Products' })
    if (to === 'contact') navigation.navigate('Tabs', { screen: 'Contact' })
    if (to === 'home') navigation.navigate('Tabs', { screen: 'Home' })
  }

  const companyLinks: [string, FooterLink][] = [
    [t('about_us'), 'home'],
    [t('careers'), 'home'],
    [t('press'), 'home'],
    [t('blog'), 'home'],
    [t('contact_footer'), 'contact'],
  ]

  const supportLinks: [string, FooterLink][] = [
    [t('help_center'), 'contact'],
    [t('track_order'), 'products'],
    [t('returns'), 'contact'],
    [t('warranty'), 'contact'],
    [t('community'), 'contact'],
  ]

  return (
    <View className="mt-5 bg-[#1A1D20] px-4 pt-10 pb-32">
      <View className="gap-8">
        <View className="items-center gap-6 border-b border-gray-800 pb-8">
          <View className="items-center">
            <Text className="mb-2 text-center text-2xl font-bold text-white">
              {t('stay_in_loop')}
            </Text>
            <Text className="text-center text-sm text-gray-400 dark:text-gray-500">{t('stay_in_loop_desc')}</Text>
          </View>
          <View className="w-full gap-2">
            <TextInput
              placeholder={t('email_input_placeholder')}
              placeholderTextColor="#9ca3af"
              className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white"
            />
            <Pressable className="items-center rounded-xl bg-orange-600 px-6 py-3 active:opacity-80">
              <Text className="font-bold text-white">{t('subscribe')}</Text>
            </Pressable>
          </View>
        </View>

        <View className="gap-8">
          <View className="gap-3">
            <View className="flex-row items-center gap-0.5">
              <Text className="text-2xl font-black tracking-tight text-white">e-shop</Text>
              <View className="mb-0.5 h-2 w-2 rounded-full bg-orange-500" />
            </View>
            <Text className="text-sm leading-relaxed text-gray-400 dark:text-gray-500">{t('footer_brand_desc')}</Text>
            <View className="mt-1 flex-row items-center gap-3">
              {socialIcons.map((name) => (
                <View key={name} className="rounded-full bg-gray-800 p-2">
                  <Ionicons name={name} size={14} color="#9ca3af" />
                </View>
              ))}
            </View>
          </View>

            <View className="flex flex-row gap-8">

          <View className="gap-3">
            <Text className="text-base font-bold text-white">{t('company')}</Text>
            <View className="gap-2">
              {companyLinks.map(([label, to]) => (
                <Pressable key={label} onPress={() => linkPress(to)}>
                  <Text className="text-sm text-gray-400 dark:text-gray-500">{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-base font-bold text-white">{t('support')}</Text>
            <View className="gap-2">
              {supportLinks.map(([label, to]) => (
                <Pressable key={label} onPress={() => linkPress(to)}>
                  <Text className="text-sm text-gray-400 dark:text-gray-500">{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-base font-bold text-white">{t('legal')}</Text>
            <View className="gap-2">
              <Text className="text-sm text-gray-400 dark:text-gray-500">{t('privacy_policy')}</Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500">{t('terms_of_use')}</Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500">{t('cookie_settings')}</Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500">{t('accessibility')}</Text>
            </View>
          </View>

          </View>

        </View>

        <View className="border-t border-gray-800 pt-8">
          <Text className="mb-4 text-center text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {t('all_rights', { year: new Date().getFullYear() })}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Footer
