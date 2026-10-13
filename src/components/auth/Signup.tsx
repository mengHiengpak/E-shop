import { useState } from 'react'
import {
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
import { useSignup } from '../hook/Auth/useSignup'
import type { AppNavigation } from '../../navigation/types'

function Signup() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { t } = useLanguage()
  const navigation = useNavigation<AppNavigation>()
  const { signup, isLoading, error } = useSignup()

  const handleSubmit = async (): Promise<void> => {
    try {
      await signup({ phone, name, email, password, confirmPassword })
      navigation.navigate('Signin')
    } catch (err) {
      console.error('Register failed:', err)
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-stone-100 dark:bg-[#0b1220]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
        <View className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] p-8 shadow-md">
          <View className="mb-8 items-center">
            <View className="flex-row items-center gap-0.5">
              <Text className="text-3xl text-slate-900 dark:text-white">{t('Sign_Up')}</Text>
              <View className="mb-1.5 h-2 w-2 rounded-full bg-[#FF5243]" />
            </View>
            <Text className="mt-2 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-500">
              {t('CREATE_AN_ACCOUNT')}
            </Text>
            <View className="mx-auto mt-4 h-px w-12 bg-amber-700" />
          </View>

          {error ? (
            <View className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 p-3">
              <Text className="text-center text-xs text-red-600">{error}</Text>
            </View>
          ) : null}

          <View className="gap-4">
            <View className="gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {t('EMAIL_ADDRESS')}
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="mail" size={16} color="#94a3b8" />
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
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {t('USERNAME')}
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="person" size={16} color="#94a3b8" />
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  className="flex-1 py-3 pl-2 text-sm text-slate-800 dark:text-slate-200"
                />
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {t('PHONE_NUMBER')}
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="call" size={16} color="#94a3b8" />
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="Phone Number"
                  placeholderTextColor="#94a3b8"
                  value={phone}
                  onChangeText={setPhone}
                  className="flex-1 py-3 pl-2 text-sm text-slate-800 dark:text-slate-200"
                />
              </View>
            </View>

            <View className="gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {t('rePASSWORD')}
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="lock-closed" size={16} color="#94a3b8" />
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

            <View className="gap-1.5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
                {t('CONFIRM_PASSWORD')}
              </Text>
              <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
                <Ionicons name="shield-checkmark" size={16} color="#94a3b8" />
                <TextInput
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="flex-1 py-3 pl-2 text-sm text-slate-800 dark:text-slate-200"
                />
              </View>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              className="mt-2 items-center rounded-xl border-slate-900 bg-slate-900 py-3 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-xs font-semibold uppercase tracking-widest text-white">
                {isLoading ? t('LOADING') : t('SIGN_UP')}
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 flex-row justify-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <Text className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{t('Already_have_an_account')} </Text>
            <Pressable onPress={() => navigation.navigate('Signin')}>
              <Text className="text-xs font-semibold text-slate-900 dark:text-white">{t('Sign_in_here')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Signup
