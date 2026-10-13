import { ActivityIndicator, View } from 'react-native'

function Loading() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-[#111827]">
      <ActivityIndicator size="large" color="#ea580c" />
    </View>
  )
}

export default Loading
