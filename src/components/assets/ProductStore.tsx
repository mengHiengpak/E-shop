import { Ionicons } from '@expo/vector-icons'
import { FlatList, Image, Modal, Pressable, Text, View } from 'react-native'
import { apiUrlBase } from '../../config/env'
import { useLanguage } from '../hook/LanguageContext'
import { useProduct } from '../hook/useProduct'
import type { CartItem } from '../../types'

interface ProductStoreProps {
  open: boolean
  closeOpen: () => void
  products?: CartItem[]
  onIncrease?: (id: string, delta: number) => void
  onRemove?: (storeId: string) => void
  onCheckout?: () => void
}

function getPrice(item: CartItem): number {
  return Number(item.uniPrice ?? item.unitPrice ?? 0)
}

function getQty(item: CartItem): number {
  return Number(item.quantity ?? item.purchasedQuantity ?? 1)
}

function buildImageUri(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined
  if (/^https?:\/\//.test(imageUrl)) return imageUrl
  return `${apiUrlBase}/uploads/${imageUrl.replace(/^\/+/, '')}`
}

function ProductStore({
  open,
  closeOpen,
  products = [],
  onIncrease,
  onRemove,
  onCheckout,
}: ProductStoreProps) {
  const { t } = useLanguage()
  const { data: allProducts } = useProduct()

  const total = products.reduce((sum, item) => sum + getPrice(item) * getQty(item), 0)

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={closeOpen}>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1 bg-black/40" onPress={closeOpen} />

        <View className="h-[80%] rounded-t-3xl bg-white dark:bg-[#0b1220]">
          <View className="flex-row items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3">
            <Text className="text-lg font-bold text-[#1A1D20] dark:text-white">
              {t('title_storing')}
            </Text>
            <Pressable onPress={closeOpen} className="p-2 active:opacity-80">
              <Ionicons name="close" size={20} color="#9ca3af" />
            </Pressable>
          </View>

          {products.length === 0 ? (
            <View className="items-center gap-1 px-4 py-10">
              <Ionicons name="cart-outline" size={32} color="#9ca3af" />
              <Text className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('status_storing')}
              </Text>
              <Text className="text-xs text-gray-400 dark:text-gray-500">{t('add_storing')}</Text>
            </View>
          ) : (
            <FlatList
              className="flex-1"
              data={products}
              keyExtractor={(item, index) =>
                String(
                  item.storeId ||
                    item._id ||
                    (typeof item.product === 'object' ? item.product?._id : item.product) ||
                    index
                )
              }
              renderItem={({ item }) => {
                const product = typeof item.product === 'object' ? item.product : undefined
                const productId =
                  item.productId ??
                  (typeof item.product === 'string' ? item.product : product?._id) ??
                  item._id
                const detail = allProducts.find((entry) => entry._id === productId)
                const imageUri = buildImageUri(
                  item.imageUrl || product?.imageUrl || detail?.imageUrl
                )
                const name = item.productName || product?.name || detail?.name
                const id = item.storeId || item._id || product?._id || ''
                const price = getPrice(item)
                const qty = getQty(item)
                return (
                  <View className="flex-row gap-3 border-b border-gray-100 dark:border-gray-800 p-4">
                    {imageUri ? (
                      <Image
                        source={{ uri: imageUri }}
                        className="h-16 w-16 rounded-xl bg-gray-100 dark:bg-gray-800"
                        resizeMode="contain"
                      />
                    ) : (
                      <View className="h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                        <Ionicons name="image-outline" size={20} color="#9ca3af" />
                      </View>
                    )}
                    <View className="flex-1 gap-1">
                      <Text numberOfLines={1} className="font-semibold text-[#1A1D20] dark:text-white">
                        {name}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">Qty: {qty}</Text>
                      <Text className="text-sm font-bold text-[#1A1D20] dark:text-white">
                        ៛{price.toFixed(2)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2 self-center">
                      {onIncrease ? (
                        <>
                          <Pressable
                            onPress={() => onIncrease(id, -1)}
                            className="h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 active:opacity-80"
                          >
                            <Ionicons name="remove" size={14} color="#4b5563" />
                          </Pressable>
                          <Pressable
                            onPress={() => onIncrease(id, 1)}
                            className="h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 active:opacity-80"
                          >
                            <Ionicons name="add" size={14} color="#4b5563" />
                          </Pressable>
                        </>
                      ) : null}
                      {onRemove ? (
                        <Pressable
                          onPress={() => onRemove(id)}
                          className="h-7 w-7 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40 active:opacity-80"
                        >
                          <Ionicons name="trash" size={14} color="#ef4444" />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                )
              }}
            />
          )}

          {products.length > 0 ? (
            <View className="gap-3 border-t border-gray-200 dark:border-gray-800 px-4 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Total</Text>
                <Text className="text-lg font-bold text-[#1A1D20] dark:text-white">
                  ៛{total.toFixed(2)}
                </Text>
              </View>
              {onCheckout ? (
                <Pressable
                  onPress={onCheckout}
                  className="items-center rounded-xl bg-orange-600 py-3.5 active:opacity-80"
                >
                  <Text className="font-bold text-white">{t('buy_now')}</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  )
}

export default ProductStore
