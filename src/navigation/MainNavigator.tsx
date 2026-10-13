import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Header from '../components/theme/Header'
import MainTabs from './MainTabs'
import ProductDetail from '../components/template/ProductDetail'
import BuyMethod from '../components/BuyMethod'
import ProductStorePayment from '../components/assets/ProductStorePayment'
import WelletMethod from '../components/WelletMethod'
import MyOrder from '../components/template/MyOrder'
import Wallets from '../components/theme/Wallets'
import Address from '../components/template/Address'
import AccountDetail from '../components/template/AccountDetail'
import type { MainStackParamList } from './types'

const Stack = createNativeStackNavigator<MainStackParamList>()

function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={MainTabs}
        options={{ header: () => <Header /> }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ header: () => <Header /> }}
      />
      <Stack.Screen name="BuyMethod" component={BuyMethod} options={{ title: 'Checkout' }} />
      <Stack.Screen
        name="ProductStorePayment"
        component={ProductStorePayment}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen name="WelletMethod" component={WelletMethod} options={{ title: 'Wallet' }} />
      <Stack.Screen name="MyOrder" component={MyOrder} options={{ title: 'My Orders' }} />
      <Stack.Screen name="Wallets" component={Wallets} options={{ title: 'Wallet' }} />
      <Stack.Screen name="Address" component={Address} options={{ title: 'Address' }} />
      <Stack.Screen
        name="AccountDetail"
        component={AccountDetail}
        options={{ title: 'Account Details' }}
      />
    </Stack.Navigator>
  )
}

export default MainNavigator
