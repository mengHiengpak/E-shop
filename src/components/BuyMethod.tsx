import { useEffect, useState, type ComponentProps } from 'react'
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useProductById } from './hook/useProductById'
import useCurrent from './hook/Auth/useCurrent'
import { useCustomerStoreProduct } from './hook/useCustomerStoreProduct'
import { apiUrlBase } from '../config/env'
import { usePayment } from './hook/payments/usePayment'
import type { AppRoute } from '../navigation/types'

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface FieldProps {
  icon: IoniconName
  label: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

const Field = ({ icon, label, type = 'text', placeholder, value, onChange }: FieldProps) => (
  <View>
    <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 dark:text-slate-500">
      {label}
    </Text>
    <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] px-3">
      <Ionicons name={icon} size={16} color="#94a3b8" />
      <TextInput
        autoCapitalize="none"
        keyboardType={type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        value={value}
        onChangeText={onChange}
        className="flex-1 py-3 pl-2 text-sm text-slate-800 dark:text-slate-200"
      />
    </View>
  </View>
)

interface CheckoutForm {
  name: string
  phone: string
  email: string
  address: string
}

function BuyMethod() {
  const route = useRoute<AppRoute<'BuyMethod'>>()
  const id = route.params?.id
  const { products } = useProductById('product', id)
  const { data: customer } = useCurrent()
  const { sale, loading } = useCustomerStoreProduct()
  const { payment, loading: paymentLoading } = usePayment()

  const doc = products?.result?.doc
  const price = Number(doc?.salePrice || 0)

  const [form, setForm] = useState<CheckoutForm>({ name: '', phone: '', email: '', address: '' })

  useEffect(() => {
    if (!customer) return
    setForm((current) => ({
      name: current.name || customer.name || '',
      phone: current.phone || customer.phone || '',
      email: current.email || customer.email || '',
      address: current.address || customer.address || '',
    }))
  }, [customer])

  const handleSubmit = async (): Promise<void> => {
    if (!customer || !price) return
    const created = await sale({
      customer: customer._id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      items: [{ product: id, quantity: 1, uniPrice: price, totalPrice: price }],
      totalCost: price,
    })
    const storeId = created?.result?.customerStore?._id || created?.result?._id || created?._id
    if (storeId) await payment(storeId, { paidAmount: price })
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-[#111827]"
      contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="gap-6">
        <View className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
          <Text className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Order Summary
          </Text>
          <View className="mt-6 gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
            <View className="flex-row items-center gap-3">
              {doc?.imageUrl && (
                <Image
                  source={{ uri: `${apiUrlBase}/uploads/${doc.imageUrl}` }}
                  className="h-14 w-14 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#111827]"
                  resizeMode="contain"
                />
              )}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-slate-900 dark:text-white" numberOfLines={1}>
                  {doc?.name || 'Product'}
                </Text>
                <Text className="text-xs text-slate-400 dark:text-slate-500">Qty × 1</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Total</Text>
              <Text className="text-lg font-bold text-slate-900 dark:text-white">៛{price.toFixed(2)}</Text>
            </View>
            <View className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3">
              <Text className="text-xs text-emerald-700">
                Payment is taken from your wallet balance.
              </Text>
            </View>
          </View>
        </View>

        <View className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
          <View className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-5">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Form Information</Text>
            <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Enter your delivery details to complete the purchase.
            </Text>
          </View>
          <View className="gap-5">
            <Field
              icon="person"
              label="Name"
              placeholder="John Doe"
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
            />
            <Field
              icon="call"
              label="Phone"
              type="tel"
              placeholder="012 345 678"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
            />
            <Field
              icon="mail"
              label="Email"
              type="email"
              placeholder="name@gmail.com"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
            />
            <Field
              icon="location"
              label="Address"
              placeholder="Street, City"
              value={form.address}
              onChange={(value) => setForm({ ...form, address: value })}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={loading || paymentLoading}
            className="mt-6 items-center rounded-xl bg-slate-900 py-3.5 active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-white">
              {loading || paymentLoading ? 'Processing...' : `Pay ៛${price.toFixed(2)}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

export default BuyMethod
