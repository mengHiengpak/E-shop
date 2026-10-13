import { ScrollView, Text, View } from 'react-native'
import { useLanguage } from '../hook/LanguageContext'
import { useCustomerProduct } from '../hook/customerProduct/useCustomerProduct'

function MyOrder() {
  const { t } = useLanguage()
  const { isLoading, error, data: orders } = useCustomerProduct()

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-[#0b1220]"
      contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">{t('order_history')}</Text>
        <Text className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 dark:text-gray-500">
          {t('orders_count', { count: orders.length })}
        </Text>
      </View>

      {isLoading && <Text className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{t('loading')}</Text>}
      {error && <Text className="text-sm text-red-500">{error}</Text>}

      {orders.length === 0 && !isLoading && !error ? (
        <View className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
          <Text className="text-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{t('no_orders')}</Text>
        </View>
      ) : (
        orders.map((order, index) => (
          <View
            key={order._id || order.id || index}
            className="mb-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 shadow-sm"
          >
            <View className="gap-3">
              <View className="flex-row flex-wrap items-center gap-3">
                <Text className="font-semibold text-gray-900 dark:text-white">{`#eshop-${order.invoiceNumber || order._id}`}</Text>
                <Text className="rounded-full border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/40 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                  {order.status || t('delivered')}
                </Text>
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
                {order.createdAt || ''} ·{' '}
                {t('items_count', {
                  count: order.purchasedQuantity || order.items?.length || 0,
                })}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-gray-900 dark:text-white">
                  ៛{Number(order.totalPrice ?? order.total ?? 0).toFixed(2)}
                </Text>
                <View className="flex-row gap-2">
                  <Text className="rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('view_details')}
                  </Text>
                  <Text className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
                    {t('reorder')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}

export default MyOrder
