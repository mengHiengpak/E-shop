import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../hook/LanguageContext'
import { useTheme } from '../hook/ThemeContext'
import { useProductById } from '../hook/useProductById'
import { useCategory } from '../hook/useCategory'
import { localizeCategory } from '../languages/categoryNames'
import { apiUrlBase } from '../../config/env'
import { useCustomerStoreProduct } from '../hook/useCustomerStoreProduct'
import { useStore } from '../hook/StoreContext'
import useCurrent from '../hook/Auth/useCurrent'
import type { AppNavigation, AppRoute } from '../../navigation/types'
import type { Category } from '../../types'

function ProductDetail() {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const navigation = useNavigation<AppNavigation>()
  const route = useRoute<AppRoute<'ProductDetail'>>()
  const id = route.params.id
  const { products, refetch } = useProductById('product', id)
  const { category } = useCategory()
  const [categories, setCategories] = useState<Category[]>([])
  const [quantity, setQuantity] = useState(1)
  const { sale, loading } = useCustomerStoreProduct()
  const { refresh: refreshStore } = useStore()
  const { data: customer } = useCurrent()

  useEffect(() => {
    category()
      .then(setCategories)
      .catch(() => {})
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doc = products?.result?.doc
  const categoryValue = doc?.category
  const categoryId = typeof categoryValue === 'object' ? categoryValue?._id : categoryValue
  const categoryName =
    categories.find((item) => item._id === categoryId)?.name ||
    (typeof categoryValue === 'object' ? categoryValue?.name : '') ||
    ''

  const decreaseQuantity = (): void => {
    if (quantity > 1) setQuantity(quantity - 1)
  }
  const increaseQuantity = (): void => setQuantity(quantity + 1)

  const salePrice = Number(doc?.salePrice || 0)
  const costPrice = Number(doc?.costPrice || 0)
  const totalprice = quantity * salePrice

  const handleSubmit = async (): Promise<void> => {
    await sale({
      customer: customer?._id,
      items: [
        {
          product: id,
          quantity,
          uniPrice: salePrice,
          totalPrice: totalprice,
        },
      ],
      totalCost: totalprice,
    })
    refetch()
    await refreshStore()
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 16 }}
    >
      <Pressable
        onPress={() => navigation.goBack()}
        className="mb-4 h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] active:opacity-70"
      >
        <Ionicons name="arrow-back" size={20} color={isDark ? '#e5e7eb' : '#1A1D20'} />
      </Pressable>
      <View className="gap-8">
        <View className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] p-8">
          <Image
            source={{ uri: `${apiUrlBase}/uploads/${doc?.imageUrl}` }}
            className="h-64 w-full"
            resizeMode="contain"
          />
        </View>

        <View className="gap-6">
          <View className="flex-row items-center gap-3">
            <Text className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
              {localizeCategory(categoryName, language) || t('all_category')}
            </Text>
            <Text className="rounded-full bg-orange-100 dark:bg-orange-900/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-300">
              {t('best_seller')}
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-3xl font-black text-[#1A1D20] dark:text-white">{doc?.name}</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="star" size={14} color="#facc15" />
                <Text className="text-sm font-bold text-gray-900 dark:text-white">4.8</Text>
                <Text className="text-sm text-gray-400 dark:text-gray-500">· 2,341 {t('reviews_label')}</Text>
              </View>
              <Text
                className={`text-xs font-bold ${
                  Number(doc?.currentstock) > 0 ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {Number(doc?.currentstock) > 0 ? t('in_stock') : t('out_of_stock')}
              </Text>
            </View>
          </View>

          <View className="gap-3 border-y border-gray-100 dark:border-gray-800 py-4">
            <View className="flex-row flex-wrap items-center gap-3">
              <Text className="text-3xl font-black text-[#1A1D20] dark:text-white">{`${costPrice.toFixed(2)}៛`}</Text>
              <Text
                className="text-lg text-gray-400 dark:text-gray-500"
                style={{ textDecorationLine: 'line-through' }}
              >
                {`${salePrice.toFixed(2)}៛`}
              </Text>
              <Text className="rounded-md bg-red-100 dark:bg-red-900/40 px-2 py-1 text-xs font-bold text-red-600 dark:text-red-300">
                -30%
              </Text>
            </View>
          </View>

          <View className="gap-4">
            <View className="w-fit gap-2">
              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('quantity')}</Text>
              <View className="flex-row w-32 items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#111827] px-3 py-2">
                <Pressable
                  onPress={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-1 disabled:opacity-30"
                >
                  <Ionicons name="remove" size={16} color="#4b5563" />
                </Pressable>
                <Text className="text-base font-bold text-gray-900 dark:text-white">{quantity}</Text>
                <Pressable onPress={increaseQuantity} className="p-1">
                  <Ionicons name="add" size={16} color="#4b5563" />
                </Pressable>
              </View>
            </View>

            <View className="gap-4">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className="items-center rounded-2xl bg-[#1A1D20] py-4 active:opacity-80 disabled:opacity-40 dark:bg-gray-100"
              >
                <Text className="font-bold text-white dark:text-[#1A1D20]">
                  {loading ? t('loading') : t('add_to_cart')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate('BuyMethod', { id })}
                className="items-center rounded-2xl bg-orange-600 py-4 active:opacity-80"
              >
                <Text className="font-bold text-white">{t('buy_now')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProductDetail
