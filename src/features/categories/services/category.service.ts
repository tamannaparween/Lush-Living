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

export function addCategory(category: Category): void {
  const categories = getCategories()
  saveCategories([...categories, category])
}

export function updateCategory(updatedCategory: Category): void {
  const categories = getCategories()

  const updatedCategories = categories.map((category) =>
    category.id === updatedCategory.id ? updatedCategory : category,
  )

  saveCategories(updatedCategories)
}

export function deleteCategory(id: string): void {
  const categories = getCategories()
  saveCategories(categories.filter((category) => category.id !== id))
}