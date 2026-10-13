import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'

interface AddressAddProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

function AddressAdd({ open, onClose, title, children }: AddressAddProps) {
  if (!open) return null

  return (
    <View className="absolute inset-0 flex-1 items-center justify-center bg-black/40 p-4">
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
  )
}

export default AddressAdd
