import { useEffect, useState, type ComponentProps } from 'react'
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import useCurrent from '../hook/Auth/useCurrent'
import { useCustomerStore } from '../hook/useCustomerStore'
import { useProduct } from '../hook/useProduct'
import { apiUrlBase } from '../../config/env'
import { usePayment } from '../hook/payments/usePayment'

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

interface PaymentItem {
  id?: string
  storeId?: string
  productId?: string
  productName: string
  unitPrice: number
  imageUrl: string
  quantity: number
}

interface CheckoutForm {
  name: string
  phone: string
  email: string
  address: string
}

function ProductStorePayment() {
  const { data: customer } = useCurrent()
  const { data, isLoading, refetch } = useCustomerStore(customer?._id)
  const { data: allProducts } = useProduct()
  const { payment, loading: paymentLoading } = usePayment()
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

  const items: PaymentItem[] = (data?.products || []).map((item) => {
    const rawProduct = item.product
    const productId =
      item.productId ??
      (typeof rawProduct === 'string' ? rawProduct : rawProduct?._id) ??
      item._id
    const productDetail = allProducts.find((product) => product._id === productId)
    const unitPrice = Number(item.unitPrice ?? item.uniPrice ?? productDetail?.salePrice ?? 0)
    return {
      id: item.storeId ?? item._id ?? productId,
      storeId: item.storeId,
      productId,
      productName: item.productName ?? productDetail?.name ?? 'Product',
      unitPrice,
      imageUrl: item.imageUrl ?? productDetail?.imageUrl ?? '',
      quantity: Number(item.purchasedQuantity ?? item.quantity ?? 1),
    }
  })

  const totalCost = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const storeId = data?.storeId ?? data?._id ?? items[0]?.storeId

  const handleSubmit = async (): Promise<void> => {
    if (storeId) {
      await payment(storeId, { paidAmount: totalCost })
    }
    refetch()
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
          {isLoading && <Text className="mt-6 text-sm text-slate-400 dark:text-slate-500">Loading...</Text>}
          {!isLoading && items.length === 0 && (
            <Text className="mt-6 text-sm text-slate-400 dark:text-slate-500">Your cart is empty.</Text>
          )}
          {items.length > 0 && (
            <View className="mt-6 gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
              {items.map((item) => (
                <View key={item.id} className="flex-row items-center gap-3">
                  {item.imageUrl && (
                    <Image
                      source={{ uri: `${apiUrlBase}/uploads/${item.imageUrl}` }}
                      className="h-14 w-14 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#111827]"
                      resizeMode="contain"
                    />
                  )}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-slate-900 dark:text-white" numberOfLines={1}>
                      {item.productName}
                    </Text>
                    <Text className="text-xs text-slate-400 dark:text-slate-500">Qty × {item.quantity}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-slate-900 dark:text-white">
                    ៛{(item.unitPrice * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View className="flex-row items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <Text className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Total</Text>
                <Text className="text-lg font-bold text-slate-900 dark:text-white">៛{totalCost.toFixed(2)}</Text>
              </View>
              <View className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3">
                <Text className="text-xs text-emerald-700">
                  Payment is taken from your wallet balance.
                </Text>
              </View>
            </View>
          )}
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
              value={form.name}
              onChange={(value) => setForm({ ...form, name: value })}
              placeholder="John Doe"
            />
            <Field
              icon="call"
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(value) => setForm({ ...form, phone: value })}
              placeholder="012 345 678"
            />
            <Field
              icon="mail"
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              placeholder="name@gmail.com"
            />
            <Field
              icon="location"
              label="Address"
              value={form.address}
              onChange={(value) => setForm({ ...form, address: value })}
              placeholder="Street, City"
            />
          </View>
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading || paymentLoading || items.length === 0}
            className="mt-6 items-center rounded-xl bg-slate-900 py-3.5 active:opacity-80 disabled:opacity-50"
          >
            <Text className="text-sm font-semibold uppercase tracking-wider text-white">
              {isLoading || paymentLoading ? 'Processing...' : `Pay ៛${totalCost.toFixed(2)}`}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProductStorePayment
