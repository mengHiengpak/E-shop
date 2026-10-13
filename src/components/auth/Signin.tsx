import { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useLanguage } from '../hook/LanguageContext'
import { useSignin } from '../hook/Auth/useSignin'
import type { AppNavigation } from '../../navigation/types'

function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { t } = useLanguage()
  const navigation = useNavigation<AppNavigation>()
  const { signin, isLoading, error } = useSignin()

  const handleSubmit = async (): Promise<void> => {
    try {
      await signin(email, password)
      // RootNavigator swaps to the signed-in stack once refetch resolves.
    } catch (err) {
      console.error('Sign in failed:', err)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-stone-100 dark:bg-[#0b1220]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center p-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] p-8 shadow-md">
          <View className="mb-8 items-center">
            <View className="flex-row items-center gap-0.5">
              <Text className="text-3xl text-slate-900 dark:text-white">{t('Sign_In')}</Text>
              <View className="mb-1.5 h-2 w-2 rounded-full bg-[#FF5243]" />
            </View>
            <Text className="mt-2 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">
              {t('ACCESS_YOUR_ACCOUNT')}
            </Text>
            <View className="mx-auto mt-4 h-px w-12 bg-amber-700" />
          </View>

          <View className="gap-6">
            <View className="gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {t('EMAIL_ADDRESS')}
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="mail-outline" size={16} color="#94a3b8" />
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="name@gmail.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  className="flex-1 py-3 pl-2 text-sm text-slate-800 dark:text-slate-200"
                />
              </View>
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                  {t('PASSWORD')}
                </Text>
                <Pressable onPress={() => navigation.navigate('Forgot')}>
                  <Text className="text-xs text-amber-800 dark:text-amber-400">{t('Forgot')}</Text>
                </Pressable>
              </View>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" />
                <TextInput
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  className="flex-1 py-3 pl-2 text-sm text-slate-800 dark:text-slate-200"
                />
              </View>
            </View>

            {error ? (
              <View className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-4 py-2.5">
                <Text className="text-xs font-semibold text-red-600">{error}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              className="items-center rounded-xl bg-slate-900 py-3.5 active:opacity-80 disabled:opacity-50"
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-xs font-semibold uppercase tracking-widest text-white">
                  {t('SIGN_IN')}
                </Text>
              )}
            </Pressable>
          </View>

          <View className="mt-8 flex-row justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <Text className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{t('Need_an_account')} </Text>
            <Pressable onPress={() => navigation.navigate('Signup')}>
              <Text className="text-xs font-semibold text-slate-900 dark:text-white">{t('Register_here')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Signin
