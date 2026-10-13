
import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../components/hook/LanguageContext'
import { localizeCategory } from '../components/languages/categoryNames'
import { useCategory } from '../components/hook/useCategory'
import { useProduct } from '../components/hook/useProduct'
import { useCustomerStoreProduct } from '../components/hook/useCustomerStoreProduct'
import { useStore } from '../components/hook/StoreContext'
import useCurrent from '../components/hook/Auth/useCurrent'
import { apiUrlBase } from '../config/env'
import type { AppNavigation, AppRoute } from '../navigation/types'
import type { Category, Product as ProductModel } from '../types'

const getCategoryId = (product: ProductModel): string | undefined =>
  typeof product.category === 'object' ? product.category?._id : product.category

const formatCurrency = (value: unknown): string =>
  Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Product() {
  const { t, language } = useLanguage()
  const navigation = useNavigation<AppNavigation>()
  const route = useRoute<AppRoute<'Products'>>()
  const { isLoading, error, data: products } = useProduct()
  const { sale, loading } = useCustomerStoreProduct()
  const { refresh: refreshStore } = useStore()
  const { data: customer } = useCurrent()
  const { category } = useCategory()
  const [categories, setCategories] = useState<Category[]>([])

  const activeCategory = route.params?.category || 'all'
  const keyword = (route.params?.search || '').trim().toLowerCase()

  const setActiveCategory = (cat: string): void => {
    navigation.setParams({ category: cat === 'all' ? undefined : cat })
  }

  useEffect(() => {
    category()
      .then(setCategories)
      .catch(() => {})
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = products.filter((product) => {
    const categoryOk = activeCategory === 'all' || getCategoryId(product) === activeCategory
    const keywordOk =
      !keyword ||
      (product.name || '').toLowerCase().includes(keyword) ||
      (product.code || '').toLowerCase().includes(keyword)
    return categoryOk && keywordOk
  })

  const getDiscount = (product: ProductModel): string | null => {
    const cost = Number(product.costPrice)
    const salePrice = Number(product.salePrice)
    if (!cost || !salePrice || cost <= salePrice) return null
    return `-${Math.round((1 - salePrice / cost) * 100)}%`
  }

  const addToStore = async (product: ProductModel): Promise<void> => {
    const totalPrice = Number(product.salePrice) || 0
    await sale({
      customer: customer?._id,
      items: [
        {
          product: product._id,
          quantity: 1,
          uniPrice: totalPrice,
          totalPrice,
        },
      ],
      totalCost: totalPrice,
    })
    await refreshStore()
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingTop: 32, paddingHorizontal: 16, paddingBottom: 120 }}
    >
      <View className="mb-5 gap-4">
        <View>
          <Text className="text-2xl font-black tracking-tight text-[#1A1D20] dark:text-white">
            {t('featured_products')}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">{t('products_found', { count: filtered.length })}</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => setActiveCategory('all')}
              className={`rounded-full px-6 py-2 ${activeCategory === 'all' ? 'bg-orange-600' : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]'}`}
            >
              <Text
                className={`font-bold ${activeCategory === 'all' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
              >
                {t('all_btn')}
              </Text>
            </Pressable>
            {categories.map((cat) => (
              <Pressable
                key={cat._id}
                onPress={() => setActiveCategory(cat._id)}
                className={`rounded-full px-6 py-2 ${activeCategory === cat._id ? 'bg-orange-600' : 'border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827]'}`}
              >
                <Text
                  className={`font-bold ${activeCategory === cat._id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {localizeCategory(cat.name, language)}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {isLoading && <Text className="py-10 text-center text-gray-500 dark:text-gray-400">{t('loading')}</Text>}
      {error && <Text className="py-10 text-center text-red-500">{error}</Text>}

      <View className="flex-row flex-wrap gap-4">
        {filtered.map((product) => (
          <Pressable
            key={product._id}
            onPress={() => navigation.navigate('ProductDetail', { id: product._id })}
            className="w-[48%] overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm"
          >
            <View className="relative bg-gray-50 dark:bg-[#111827] p-4">
              {getDiscount(product) && (
                <View className="absolute left-2 top-2 z-10 rounded-md bg-red-600 px-2 py-1">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
                    {getDiscount(product)}
                  </Text>
                </View>
              )}
              <Image
                source={{ uri: `${apiUrlBase}/uploads/${product.imageUrl}` }}
                className="h-32 w-full"
                resizeMode="contain"
              />
            </View>
            <View className="gap-1.5 p-3">
              <Text className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {localizeCategory(
                  typeof product.category === 'object' ? product.category?.name : '',
                  language
                ) || t('featured_products')}
              </Text>
              <Text className="text-sm font-bold text-[#1A1D20] dark:text-white" numberOfLines={2}>
                {product.name}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <View className="flex-row items-center gap-0.5">
                  {[...Array(5)].map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={10}
                      color={index < Math.floor(Number(product.rating) || 4.5) ? '#facc15' : '#d1d5db'}
                    />
                  ))}
                </View>
                <Text className="text-[10px] text-gray-500 dark:text-gray-400">
                  {(Number(product.rating) || 4.5).toFixed(1)}
                </Text>
              </View>
              <View className="flex-row items-end justify-between gap-2">
                <View>
                  <Text className="text-base font-black text-[#1A1D20] dark:text-white">
                    ៛{formatCurrency(product.salePrice)}
                  </Text>
                  {Number(product.costPrice) > Number(product.salePrice) && (
                    <Text
                      className="text-xs text-gray-400 dark:text-gray-500"
                      style={{ textDecorationLine: 'line-through' }}
                    >
                      ៛{formatCurrency(product.costPrice)}
                    </Text>
                  )}
                  <Text
                    className={`mt-0.5 text-[10px] font-semibold ${
                      Number(product.currentstock) > 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {Number(product.currentstock) > 0
                      ? `${t('in_stock')}: ${product.currentstock}`
                      : t('out_of_stock')}
                  </Text>
                </View>
                <Pressable
                  onPress={() => addToStore(product)}
                  disabled={loading}
                  className="rounded-xl bg-[#1A1D20] p-2.5 active:opacity-80 disabled:opacity-40"
                >
                  <Ionicons name="cart" size={16} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  )
}

export default Product
