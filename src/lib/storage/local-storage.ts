export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const storedValue = localStorage.getItem(key)

    if (storedValue === null) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }

    return JSON.parse(storedValue) as T
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save "${key}" to localStorage:`, error)
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove "${key}" from localStorage:`, error)
  }
}