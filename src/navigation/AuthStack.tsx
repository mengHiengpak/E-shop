import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Signin from '../components/auth/Signin'
import Signup from '../components/auth/Signup'
import ForgetPS from '../components/auth/ForgetPS'
import type { AuthStackParamList } from './types'

const Stack = createNativeStackNavigator<AuthStackParamList>()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Forgot" component={ForgetPS} />
    </Stack.Navigator>
  )
}

export default AuthStack
