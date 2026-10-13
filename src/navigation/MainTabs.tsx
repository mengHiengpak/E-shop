import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../page/Home'
import Product from '../page/Product'
import Contact from '../page/Contact'
import Account from '../page/Account'
import FloatingTabBar from './FloatingTabBar'
import type { MainTabParamList } from './types'

const Tab = createBottomTabNavigator<MainTabParamList>()

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Products" component={Product} />
      <Tab.Screen name="Contact" component={Contact} />
      <Tab.Screen name="Account" component={Account} />
    </Tab.Navigator>
  )
}

export default MainTabs
