import { useState, type ComponentProps } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { WebView } from 'react-native-webview'
import toast from '../config/toast'
import { useLanguage } from '../components/hook/LanguageContext'

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface ContactItem {
  label: string
  line1: string
  line2: string
  icon: IoniconName
}

function Contact() {
  const { t } = useLanguage()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const contactItems: ContactItem[] = [
    {
      label: t('visit_our_store'),
      line1: t('store_address_1'),
      line2: t('store_address_2'),
      icon: 'location',
    },
    { label: t('call_us'), line1: '096 635 5105', line2: t('call_hours'), icon: 'call' },
    {
      label: t('email_us'),
      line1: 'menghiengpak096@eshop.com',
      line2: t('email_reply'),
      icon: 'mail',
    },
    {
      label: t('business_hours'),
      line1: t('business_hours_1'),
      line2: t('business_hours_2'),
      icon: 'time',
    },
  ]

  const mapHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>html, body { margin: 0; padding: 0; height: 100%; } iframe { border: 0; width: 100%; height: 100%; }</style>
  </head>
  <body>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3911.4147715197696!2d104.8914528751785!3d11.377391347821204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDIyJzM4LjYiTiAxMDTCsDUzJzM4LjUiRQ!5e0!3m2!1sen!2skh!4v1789481584990!5m2!1sen!2skh"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </body>
</html>`

  const handleSubmit = (): void => {
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    toast.success(t('send_message_success'))
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingTop: 32, paddingHorizontal: 16, paddingBottom: 120 }}
    >
      <View className="mb-8 items-center">
        <Text className="text-3xl font-black tracking-tight text-[#1A1D20] dark:text-white">{t('contact_us')}</Text>
        <Text className="mt-2 text-center text-gray-500 dark:text-gray-400">{t('contact_desc')}</Text>
      </View>

      <View className="gap-6">
        {contactItems.map((item) => (
          <View
            key={item.label}
            className="flex-row items-start gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-5 shadow-sm"
          >
            <View className="rounded-xl bg-red-50 dark:bg-red-900/40 p-3">
              <Ionicons name={item.icon} size={20} color="#dc2626" />
            </View>
            <View className="flex-1 gap-0.5">
              <Text className="font-bold text-gray-900 dark:text-white">{item.label}</Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">{item.line1}</Text>
              <Text className="text-xs text-gray-400 dark:text-gray-500">{item.line2}</Text>
            </View>
          </View>
        ))}

        <View className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
          <Text className="text-lg font-bold text-[#1A1D20] dark:text-white">{t('send_us_message')}</Text>
          <Text className="mb-6 text-sm text-gray-500 dark:text-gray-400">{t('send_message_desc')}</Text>
          <View className="gap-5">
            <View>
              <Text className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('full_name')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('full_name_placeholder')}
                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-4 py-3 text-sm"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View>
              <Text className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('email_address')}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={t('email_placeholder')}
                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-4 py-3 text-sm"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View>
              <Text className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('subject')}</Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder={t('subject_placeholder')}
                className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-4 py-3 text-sm"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View>
              <Text className="mb-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('message')}</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                placeholder={t('message_placeholder')}
                className="h-32 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-4 py-3 text-sm"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <Pressable
              onPress={handleSubmit}
              className="items-center rounded-full bg-orange-600 py-4 active:opacity-80"
            >
              <Text className="font-bold text-white">{t('send_message_btn')}</Text>
            </Pressable>
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] px-6 py-4">
            <View>
              <Text className="text-base font-bold text-[#1A1D20] dark:text-white">{t('find_us_map')}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">{t('map_address')}</Text>
            </View>
            <Pressable className="flex-row items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 px-4 py-2 active:opacity-80">
              <Ionicons name="location" size={14} color="#4b5563" />
              <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400">{t('edit')}</Text>
            </Pressable>
          </View>
          <View className="h-64 bg-gray-100 dark:bg-gray-800">
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              style={{ flex: 1, backgroundColor: 'transparent' }}
              javaScriptEnabled
              domStorageEnabled
              allowFileAccess
              allowsInlineMediaPlayback
              setSupportMultipleWindows={false}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Contact
