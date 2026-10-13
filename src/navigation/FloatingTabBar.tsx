import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useLanguage } from '../components/hook/LanguageContext'
import { useTheme } from '../components/hook/ThemeContext'
import type { MainTabParamList } from './types'

type IoniconName = ComponentProps<typeof Ionicons>['name']

const ICONS: Record<keyof MainTabParamList, IoniconName> = {
  Home: 'home-outline',
  Products: 'grid-outline',
  Contact: 'call-outline',
  Account: 'person-outline',
}

const LABEL_KEYS: Record<keyof MainTabParamList, string> = {
  Home: 'tab_home',
  Products: 'tab_products',
  Contact: 'tab_contact',
  Account: 'tab_account',
}

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const { t } = useLanguage()
  const { isDark } = useTheme()

  return (
    <View
      style={{
        bottom: Math.max(insets.bottom, 12),
        shadowColor: isDark ? '#000' : '#1e3a5f',
        shadowOpacity: 0.22,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
      }}
      className="absolute left-4 right-4"
    >
      <View className="overflow-hidden rounded-full border border-white/70 dark:border-white/15">
        <BlurView
          intensity={isDark ? 70 : 90}
          tint={isDark ? 'dark' : 'light'}
          experimentalBlurMethod="dimezisBlurView"
          style={{ backgroundColor: isDark ? 'rgba(56,89,145,0.16)' : 'rgba(198,226,255,0.20)' }}
        >
          <LinearGradient
            pointerEvents="none"
            colors={
              isDark
                ? ['rgba(255,255,255,0.20)', 'rgba(255,255,255,0.02)', 'rgba(120,170,255,0.10)']
                : ['rgba(255,255,255,0.50)', 'rgba(255,255,255,0.08)', 'rgba(140,200,255,0.18)']
            }
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View className="absolute inset-x-8 top-0 h-px bg-white/80 dark:bg-white/25" />

          <View className="flex-row items-center px-2 py-2">
            {state.routes.map((route, index) => {
              const isFocused = state.index === index
              const name = route.name as keyof MainTabParamList

              const onPress = (): void => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                })

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name)
                }
              }

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-full py-3 active:opacity-70 ${
                    isFocused ? 'bg-orange-600' : ''
                  }`}
                >
                  <Ionicons
                    name={ICONS[name]}
                    size={20}
                    color={isFocused ? '#ffffff' : isDark ? '#cbd5e1' : '#334155'}
                  />
                  {isFocused ? (
                    <Text className="text-xs font-bold text-white">{t(LABEL_KEYS[name])}</Text>
                  ) : null}
                </Pressable>
              )
            })}
          </View>
        </BlurView>
      </View>
    </View>
  )
}

export default FloatingTabBar
