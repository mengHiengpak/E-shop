export interface BaseDoc {
  _id: string
  createdAt?: string
  updatedAt?: string
}

export interface Category extends BaseDoc {
  name: string
}

export interface Product extends BaseDoc {
  name: string
  code?: string
  description?: string
  imageUrl?: string
  salePrice?: number
  costPrice?: number
  currentstock?: number
  rating?: number
  category?: Category | string
}

export interface CartItem {
  _id?: string
  product?: Product | string
  productId?: string
  productName?: string
  imageUrl?: string
  quantity?: number
  purchasedQuantity?: number
  uniPrice?: number
  unitPrice?: number
  totalPrice?: number
  storeId?: string
}

export interface CustomerStore {
  _id: string
  customer?: string
  storeId?: string
  name?: string
  phone?: string
  email?: string
  address?: string
  items?: CartItem[]
  products?: CartItem[]
  totalCost?: number
  createdAt?: string
}

export interface CartItemInput {
  product: string
  quantity: number
  uniPrice: number
  totalPrice: number
}

export interface CustomerStoreInput {
  customer?: string
  name?: string
  phone?: string
  email?: string
  address?: string
  items: CartItemInput[]
  totalCost: number
}

export interface WalletEntry {
  _id?: string
  status?: string
  fromAccountId?: string
  amount?: number
  createdAt?: string
}

export interface Customer {
  _id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  walletBalance?: number
  wallet?: WalletEntry[]
}

export interface SaleOrder {
  _id?: string
  id?: string
  invoiceNumber?: string
  status?: string
  createdAt?: string
  totalPrice?: number
  total?: number
  purchasedQuantity?: number
  items?: CartItem[]
}

export interface BakongQr {
  qr_code: string
  qr_md5: string
  message?: string
  success?: boolean
  [key: string]: unknown
}

export interface ApiEnvelope<T> {
  success?: boolean
  message?: string
  error?: string
  result?: T
  data?: T
}

export interface ProductDetailResponse {
  result?: {
    doc?: Product
    docs?: Product[]
  }
  doc?: Product
}

export interface CustomerStoreCreateResponse {
  _id?: string
  message?: string
  result?: {
    _id?: string
    customerStore?: { _id?: string }
  }
}

export type Translate = (key: string, vars?: Record<string, string | number>) => string
