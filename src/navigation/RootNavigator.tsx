import { createNativeStackNavigator } from '@react-navigation/native-stack'
import useCurrent from '../components/hook/Auth/useCurrent'
import Loading from '../components/Loading'
import AuthStack from './AuthStack'
import MainNavigator from './MainNavigator'
import type { RootStackParamList } from './types'

const Stack = createNativeStackNavigator<RootStackParamList>()

function RootNavigator() {
  const { data, isLoading } = useCurrent()

  if (isLoading) {
    return <Loading />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {data ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator
