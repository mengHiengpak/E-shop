import type { NavigatorScreenParams, RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'

export type MainTabParamList = {
  Home: undefined
  Products: { category?: string; search?: string } | undefined
  Contact: undefined
  Account: undefined
}

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<MainTabParamList> | undefined
  ProductDetail: { id: string }
  BuyMethod: { id: string }
  ProductStorePayment: undefined
  WelletMethod: { price?: number } | undefined
  MyOrder: undefined
  Wallets: undefined
  Address: undefined
  AccountDetail: undefined
}

export type AuthStackParamList = {
  Signin: undefined
  Signup: undefined
  Forgot: undefined
}

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainStackParamList> | undefined
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined
}

export type CombinedParamList = RootStackParamList &
  MainStackParamList &
  MainTabParamList &
  AuthStackParamList

export type AppNavigation = NativeStackNavigationProp<CombinedParamList>

export type AppTabNavigation = BottomTabNavigationProp<MainTabParamList>

export type AppRoute<T extends keyof CombinedParamList> = RouteProp<CombinedParamList, T>
