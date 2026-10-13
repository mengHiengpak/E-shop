import { useEffect, useRef, useState, type ComponentProps } from 'react'
import { Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { useRoute } from '@react-navigation/native'
import { useBakong } from './hook/bakong/useBakong'
import { useBakongPayment } from './hook/bakong/useBakongPayment'
import useCurrent from './hook/Auth/useCurrent'
import toast from '../config/toast'
import type { AppRoute } from '../navigation/types'
import type { BakongQr } from '../types'

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface FieldProps extends TextInputProps {
  icon: IoniconName
  label: string
}

function Field({ icon, label, ...props }: FieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</Text>
      <View className="flex-row items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#111827] px-3">
        <Ionicons name={icon} size={16} color="#94a3b8" />
        <TextInput
          placeholderTextColor="#94a3b8"
          className="flex-1 py-3 pl-2 text-sm text-slate-900 dark:text-white"
          keyboardType="numeric"
          {...props}
        />
      </View>
    </View>
  )
}

function WelletMethod() {
  const route = useRoute<AppRoute<'WelletMethod'>>()
  const price = route.params?.price || 0
  const { data: customer, isLoading } = useCurrent()
  const { generateQr, qrData, loading: qrLoading } = useBakong()
  const { verifyPayment, loading: verifyLoading } = useBakongPayment()
  const amount = price > 0 ? price : 0
  const [entered, setEntered] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState('')
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const topUp = Number(entered || amount || 0)

  const stopPolling = (): void => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current)
      pollingRef.current = null
    }
    setWaiting(false)
  }

  useEffect(() => {
    if (!customer || !topUp) {
      setError('')
      return
    }
    stopPolling()
    setConfirmed(false)
    setError('')
    ;(async () => {
      const result = await generateQr(customer._id, { amount: topUp })
      if (!result?.qr_code) {
        setError('Failed to generate the QR code. Please check the amount and try again.')
      }
    })()
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, topUp])

  const confirmPayment = async (silent = false): Promise<BakongQr | null> => {
    if (!customer || !qrData?.qr_md5) return null
    return verifyPayment(customer._id, { qr_md5: qrData.qr_md5 }, { silent })
  }

  useEffect(() => {
    if (!customer || !qrData?.qr_md5 || confirmed) return
    setWaiting(true)
    let attempts = 0
    pollingRef.current = setInterval(async () => {
      attempts += 1
      const result = await confirmPayment(true)
      if (result?.success) {
        stopPolling()
        setConfirmed(true)
        toast.success(result?.message || 'Wallet topped up successfully!')
      } else if (attempts >= 20) {
        stopPolling()
        toast.error('Payment not detected. Please scan the QR and try again.')
      }
    }, 5000)
    return stopPolling
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, qrData, confirmed])

  const handleSubmit = async (): Promise<void> => {
    if (!customer) {
      toast.error('Please sign in as a customer first.')
      return
    }
    if (!topUp) {
      toast.error('Please enter an amount greater than 0.')
      return
    }
    if (!qrData?.qr_md5) {
      const generated = await generateQr(customer._id, { amount: topUp })
      if (!generated?.qr_md5) return
    }
    const result = await confirmPayment()
    if (result?.success) {
      stopPolling()
      setConfirmed(true)
    }
  }

  const showQr = !qrLoading && !!qrData?.qr_code

  return (
    <ScrollView
      className="flex-1 bg-slate-50 dark:bg-[#111827]"
      contentContainerStyle={{ paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="gap-6">
        <View className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
          <Text className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Payment QR
          </Text>
          {customer ? (
            <Text className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Signed in as {customer.name || customer.phone || customer.email || customer._id}
            </Text>
          ) : !isLoading ? (
            <Text className="mt-1 text-xs font-medium text-red-500">You are not signed in.</Text>
          ) : null}
          <View className="mt-4 items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111827] p-6">
            {qrLoading ? (
              <Text className="text-sm text-slate-400 dark:text-slate-500">Generating QR...</Text>
            ) : confirmed ? (
              <View className="items-center gap-3 py-6">
                <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Payment confirmed, wallet topped up!
                </Text>
              </View>
            ) : showQr ? (
              <View className="items-center gap-3">
                <QRCode value={qrData.qr_code} size={192} />
                <Text className="text-xs font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500">
                  Scan to top up your wallet
                </Text>
                {waiting && (
                  <Text className="text-xs text-slate-400 dark:text-slate-500">
                    Waiting for payment confirmation...
                  </Text>
                )}
              </View>
            ) : (
              <View className="items-center gap-3">
                <View className="h-48 w-48 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                  <Text className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Scan to pay
                  </Text>
                </View>
                {error ? (
                  <Text className="text-xs font-medium text-red-500">{error}</Text>
                ) : (
                  <Text className="text-center text-xs text-slate-400 dark:text-slate-500">
                    {topUp > 0
                      ? 'No QR available — please try again.'
                      : 'Enter an amount above to generate your QR code.'}
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>

        <View className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 shadow-sm">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Add to wallet</Text>
          <Text className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Top up your wallet to cover this payment.
          </Text>
          <View className="mt-6 gap-5">
            <Field
              icon="cash"
              label="Amount"
              placeholder={amount > 0 ? `${amount} ៛` : 'Enter amount'}
              value={entered}
              onChangeText={setEntered}
            />
            <Pressable
              onPress={handleSubmit}
              disabled={qrLoading || verifyLoading || waiting || !customer}
              className="items-center rounded-xl bg-slate-900 py-3.5 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-sm font-semibold uppercase tracking-wider text-white">
                {qrLoading || verifyLoading || waiting
                  ? 'Processing...'
                  : `Add to wallet ៛${topUp.toFixed(2)}`}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default WelletMethod
