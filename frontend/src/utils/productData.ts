export type productDataType = {
  id: string
  name: string
  slug: string
  brand?: string
  categories: string
  price: number
  stock: number
  itemDescription: string
  images: string[]
  ageDescription?: string
  heightDescription?: string
}
export type productDataTypeKey = keyof productDataType
