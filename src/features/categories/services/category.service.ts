import { initialCategories } from '../data/categories.data'
import type { Category } from '../types/category.types'
import { getStorageItem, setStorageItem } from '@/lib/storage/local-storage'

const STORAGE_KEY = 'lush-living-categories'

export function getCategories(): Category[] {
  return getStorageItem<Category[]>(STORAGE_KEY, initialCategories)
}

export function saveCategories(categories: Category[]): void {
  setStorageItem(STORAGE_KEY, categories)
}

export function getActiveCategories(): Category[] {
  return getCategories().filter((category) => category.isActive)
}

export function getCategoryById(id: string): Category | undefined {
  return getCategories().find((category) => category.id === id)
}