import { ScrollView, View } from 'react-native'
import Hero from '../components/theme/Hero'
import Banner from '../components/theme/Banner'
import Product from './Product'
import Footer from '../components/theme/Footer'

function Home() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-[#0b1220]" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="gap-2">
        <Hero />
        <Product />
        <Banner />
        <Footer />
      </View>
    </ScrollView>
  )
}

export default Home
