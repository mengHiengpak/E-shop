import { useState, type ReactNode } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import toast from '../../config/toast'
import { getErrorMessage } from '../../config/errors'
import { useLanguage } from '../hook/LanguageContext'
import useCurrent from '../hook/Auth/useCurrent'
import { api } from '../../config/app'

interface AddressAddProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

function AddressAdd({ open, onClose, title, children }: AddressAddProps) {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/40 p-4">
        <View className="w-full max-w-[460px] rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-xl">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold">{title}</Text>
            <Pressable
              onPress={onClose}
              className="h-6 w-6 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40 active:opacity-80"
            >
              <Ionicons name="close" size={18} color="#ef4444" />
            </Pressable>
          </View>
          <View className="mt-4">{children}</View>
        </View>
      </View>
    </Modal>
  )
}

function Address() {
  const [isOpenStatus, setOpenStatus] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const { data, refetch } = useCurrent()
  const { t } = useLanguage()

  const addresses = data
    ? [
        {
          id: data._id || 'default',
          label: 'Home',
          name: data.name || '',
          line1: data.address || '',
          line2: data.address || '',
          phone: data.phone || '',
          isDefault: true,
        },
      ]
    : []

  const openAdd = (): void => {
    setIsEditing(false)
    setName('')
    setAddress('')
    setPhone('')
    setOpenStatus(true)
  }

  const openEdit = (): void => {
    setIsEditing(true)
    setName(data?.name || '')
    setAddress(data?.address || '')
    setPhone(data?.phone || '')
    setOpenStatus(true)
  }

  const handleSubmit = async (): Promise<void> => {
    if (!name || !address || !phone) {
      toast.error('Please fill all fields!')
      return
    }
    setIsSaving(true)
    try {
      await api.put('/customer/me', { name, address, phone })
      toast.success(isEditing ? 'Address updated successfully!' : 'Address added successfully!')
      setOpenStatus(false)
      await refetch()
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
      <AddressAdd
        open={isOpenStatus}
        onClose={() => setOpenStatus(false)}
        title={isEditing ? t('edit') : t('add_new_address')}
      >
        <View className="gap-4">
          <View>
            <Text className="mb-1.5 text-[13px] font-semibold text-gray-700 dark:text-gray-300">{t('full_name')}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View>
            <Text className="mb-1.5 text-[13px] font-semibold text-gray-700 dark:text-gray-300">{t('address')}</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="123 Main Street"
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View>
            <Text className="mb-1.5 text-[13px] font-semibold text-gray-700 dark:text-gray-300">
              {t('phone_number')}
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder={t('phone_placeholder')}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] px-3.5 py-2.5 text-sm"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Pressable
            onPress={handleSubmit}
            disabled={isSaving}
            className="items-center rounded-lg bg-gray-900 px-6 py-2.5 active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-sm font-semibold text-white">
              {isSaving ? t('LOADING') : t('save_changes')}
            </Text>
          </Pressable>
        </View>
      </AddressAdd>

      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-black text-[#1A1D20] dark:text-white">{t('addresses_title')}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{t('manage_addresses')}</Text>
        </View>
        <Text className="rounded-full bg-orange-50 dark:bg-orange-950/40 px-3 py-1 text-xs font-bold text-orange-600">
          {t('saved_count', { count: addresses.length })}
        </Text>
      </View>

      <View className="gap-4">
        {addresses.map((addr) => (
          <View key={addr.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] p-5 shadow-sm">
            <View className="flex-row items-start justify-between">
              <View className="flex-row items-start gap-3">
                <View className="rounded-lg bg-red-50 dark:bg-red-950/40 p-2.5">
                  <Ionicons name="location" size={16} color="#dc2626" />
                </View>
                <View className="flex-1 gap-1">
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Text className="text-sm font-bold text-gray-900 dark:text-white">{addr.label}</Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{addr.name}</Text>
                    {addr.isDefault && (
                      <Text className="rounded-full bg-orange-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        {t('default')}
                      </Text>
                    )}
                  </View>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">{addr.line1}</Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500">{addr.phone}</Text>
                </View>
              </View>
              <Pressable
                onPress={openEdit}
                className="flex-row items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-800 px-3 py-1.5 active:opacity-80"
              >
                <Ionicons name="create" size={14} color="#4b5563" />
                <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-500">{t('edit')}</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        onPress={openAdd}
        className="mt-5 flex-row items-center justify-center gap-1.5 rounded-full border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] py-2.5 active:opacity-80"
      >
        <Ionicons name="add" size={16} color="#4b5563" />
        <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-500">{t('add_new_address')}</Text>
      </Pressable>
    </ScrollView>
  )
}

export default Address
