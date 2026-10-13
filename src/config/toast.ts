import Toast from 'react-native-toast-message'

// Small shim that mirrors the `react-hot-toast` surface used across the app.
const toast = {
  success: (message?: unknown): void =>
    Toast.show({ type: 'success', text1: String(message ?? '') }),
  error: (message?: unknown): void =>
    Toast.show({ type: 'error', text1: String(message ?? '') }),
}

export default toast
