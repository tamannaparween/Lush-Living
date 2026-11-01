import { initialProducts } from '../data/products.data'
import type { Product } from '../types/product.types'
import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage/local-storage'

const STORAGE_KEY = 'lush-living-products'

export function getProducts(): Product[] {
  return getStorageItem<Product[]>(STORAGE_KEY, initialProducts)
}

export function saveProducts(products: Product[]): void {
  setStorageItem(STORAGE_KEY, products)
}

export function getActiveProducts(): Product[] {
  return getProducts().filter((product) => product.status === 'active')
}

export function getFeaturedProducts(): Product[] {
  return getActiveProducts().filter((product) => product.featured)
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((product) => product.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((product) => product.slug === slug)
}