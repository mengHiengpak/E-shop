import { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useLanguage } from '../hook/LanguageContext'
import { useTheme } from '../hook/ThemeContext'
import ProductStore from '../assets/ProductStore'
import { useCategory } from '../hook/useCategory'
import { localizeCategory } from '../languages/categoryNames'
import { useDeleteCustomerStoreById } from '../hook/useDeleteCustomerStoreById'
import { useStore } from '../hook/StoreContext'
import type { AppNavigation } from '../../navigation/types'
import type { Category } from '../../types'

interface ProductFilters {
  category?: string
  search?: string
}

function Header() {
  const { category } = useCategory()
  const [categories, setCategories] = useState<Category[]>([])
  const { products: storeProducts, total: cartTotal, refresh: refreshStore } = useStore()
  const { remove } = useDeleteCustomerStoreById()

  useEffect(() => {
    category()
      .then(setCategories)
      .catch(() => {})
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { language, setLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const insets = useSafeAreaInsets()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigation = useNavigation<AppNavigation>()

  const goToProducts = (params: ProductFilters = {}): void => {
    navigation.navigate('Tabs', { screen: 'Products', params })
  }

  const handleSearch = (): void => {
    const value = query.trim()
    goToProducts(value ? { search: value } : {})
  }

  const handleRemoveStoreItem = async (storeId: string): Promise<void> => {
    try {
      await remove(storeId)
      refreshStore()
    } catch {
      return
    }
  }

  const handleCheckout = (): void => {
    setIsOpen(false)
    navigation.navigate('ProductStorePayment')
  }

  return (
    <View style={{ paddingTop: insets.top }} className="bg-white dark:bg-[#0f172a]">
      <View className="border-b border-gray-100 bg-white px-3 py-2 dark:border-gray-800 dark:bg-[#0f172a]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Ionicons name="location" size={14} color="#9ca3af" />
            <Text className="text-xs text-[#5A626A] dark:text-gray-400">{t('address')}</Text>
            <View className="h-3 w-px bg-gray-300 dark:bg-gray-700" />
            <Ionicons name="call" size={14} color="#9ca3af" />
            <Text className="text-xs text-[#5A626A] dark:text-gray-400">0966355105</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setLanguage('en')}
              className={`rounded-full px-2.5 py-1 ${language === 'en' ? 'bg-orange-600' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Text
                className={`text-[11px] font-bold ${language === 'en' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                EN
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setLanguage('kh')}
              className={`rounded-full px-2.5 py-1 ${language === 'kh' ? 'bg-orange-600' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Text
                className={`text-[11px] font-bold ${language === 'kh' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                KH
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View className="px-3 py-2">
        <View className="flex-row items-center justify-between gap-3">
          <Pressable
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
            className="flex-row items-center gap-0.5"
          >
            <Text className="text-xl font-black tracking-tight text-[#1A1D20] dark:text-white">e-shop</Text>
            <View className="mb-0.5 h-2 w-2 rounded-full bg-[#FF5243]" />
          </Pressable>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={toggleTheme}
              className="items-center justify-center rounded-2xl bg-gray-100 px-2.5 py-2 active:opacity-80 dark:bg-gray-800"
            >
              <Ionicons
                name={isDark ? 'sunny' : 'moon'}
                size={18}
                color={isDark ? '#facc15' : '#1A1D20'}
              />
            </Pressable>

            <Pressable
              onPress={() => {
                refreshStore()
                setIsOpen(true)
              }}
              className="flex-row items-center gap-2 rounded-2xl bg-red-100 px-3 py-1.5 active:opacity-80 dark:bg-red-900/40"
            >
              <Ionicons name="cart" size={18} color="#ef4444" />
              <Text className="text-sm font-bold text-red-500">
                ៛{Number(cartTotal || 0).toFixed(2)}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('Tabs', { screen: 'Account' })}
              className="flex-col items-center rounded-xl px-2 py-1 active:opacity-80"
            >
              <Ionicons name="person" size={18} color={isDark ? '#e5e7eb' : '#1A1D20'} />
              <Text className="text-xs text-black dark:text-white">{t('accounts')}</Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-2 flex-row items-center overflow-hidden rounded-xl border border-[#E8EAED] dark:border-gray-700">
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholder={t('search_placeholder')}
            placeholderTextColor="#9CA3AF"
            className="flex-1 px-4 py-3 text-sm text-[#1A1D20] dark:text-white"
          />
          <Pressable
            onPress={handleSearch}
            className="items-center justify-center bg-[#FF5243] px-5 py-3 active:opacity-80"
          >
            <Ionicons name="search" size={16} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <View className="bg-orange-600">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}
        >
          <Pressable
            onPress={() => goToProducts({ category: 'all' })}
            className="rounded-full bg-white px-3 py-1"
          >
            <Text className="text-xs font-bold text-orange-600">{t('all_categories')}</Text>
          </Pressable>
          {categories.map((cat) => (
            <Pressable
              key={cat._id}
              onPress={() => goToProducts({ category: cat._id })}
              className="rounded-full px-3 py-1 active:opacity-80"
            >
              <Text className="text-xs font-bold text-white">
                {localizeCategory(cat.name, language)}
              </Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => navigation.navigate('Tabs', { screen: 'Contact' })}
            className="rounded-full px-3 py-1 active:opacity-80"
          >
            <Text className="text-xs font-bold text-white">{t('contact')}</Text>
          </Pressable>
        </ScrollView>
      </View>

      <ProductStore
        open={isOpen}
        closeOpen={() => setIsOpen(false)}
        products={storeProducts}
        onRemove={handleRemoveStoreItem}
        onCheckout={handleCheckout}
      />
    </View>
  )
}

export default Header
