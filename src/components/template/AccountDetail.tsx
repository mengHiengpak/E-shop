import { useEffect, useState, type ReactNode } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import toast from '../../config/toast'
import { getErrorMessage } from '../../config/errors'
import { useLanguage } from '../hook/LanguageContext'
import useCurrent from '../hook/Auth/useCurrent'
import { api } from '../../config/app'

const FieldLabel = ({ children }: { children: ReactNode }) => (
  <Text className="mb-1.5 text-[13px] font-semibold text-gray-700 dark:text-gray-300">{children}</Text>
)

function AccountDetail() {
  const { data } = useCurrent()
  const { t } = useLanguage()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!data) return
    const [first = '', ...rest] = String(data.name || '')
      .trim()
      .split(/\s+/)
    setFirstName(first)
    setLastName(rest.join(' '))
    setEmail(data.email || '')
    setPhone(data.phone || '')
  }, [data])

  const handleSubmit = async (): Promise<void> => {
    setIsSaving(true)
    try {
      const res = await api.put('/customer/me', {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
      })
      toast.success(res?.data?.message || 'Updated successfully!')
    } catch (err) {
      const msg = getErrorMessage(err, 'Server is error!')
      toast.error(msg)
      console.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-5">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">{t('account_details_title')}</Text>
        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{t('keep_info_current')}</Text>
      </View>

      <View className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
        <Text className="mb-5 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          {t('personal_information')}
        </Text>
        <View className="gap-5">
          <View>
            <FieldLabel>{t('first_name')}</FieldLabel>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder={t('first_name_placeholder')}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View>
            <FieldLabel>{t('last_name')}</FieldLabel>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder={t('last_name_placeholder')}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View>
            <FieldLabel>{t('email_label')}</FieldLabel>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder={t('email_detail_placeholder')}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View>
            <FieldLabel>{t('phone_number')}</FieldLabel>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder={t('phone_placeholder')}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </View>

      <View className="mt-6 flex-row justify-end gap-3">
        <Pressable className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-6 py-2.5 active:opacity-80">
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('cancel')}</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={isSaving}
          className="rounded-lg bg-gray-900 px-6 py-2.5 active:opacity-80 disabled:opacity-50"
        >
          <Text className="text-sm font-semibold text-white">
            {isSaving ? t('LOADING') : t('save_changes')}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default AccountDetail
