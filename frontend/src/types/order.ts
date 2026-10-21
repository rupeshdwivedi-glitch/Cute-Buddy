export type OrderItem = {
  id: number
  product_id: number | null
  product_name: string
  unit_price: number
  quantity: number
}

export type Order = {
  id: number
  status: string
  total_amount: number
  full_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  payment_method: string
  payment_status: string
  created_at: string
  items: OrderItem[]
}
