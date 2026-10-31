export type ProductStatus = 'active' | 'draft' | 'archived'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  categoryId: string
  images: string[]
  stock: number
  sku: string
  status: ProductStatus
  featured: boolean
  createdAt: string
  updatedAt: string
}