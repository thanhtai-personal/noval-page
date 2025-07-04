import AsyncStorage from '@react-native-async-storage/async-storage'

// Fallback for environments where the native module is unavailable (e.g. web)
let storage: typeof AsyncStorage | {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
} | null = AsyncStorage

if (!storage || typeof storage.getItem !== 'function') {
  try {
    if (typeof localStorage !== 'undefined') {
      storage = {
        async getItem(key: string) {
          return localStorage.getItem(key)
        },
        async setItem(key: string, value: string) {
          localStorage.setItem(key, value)
        },
      }
    }
  } catch {
    const memory = new Map<string, string>()
    storage = {
      async getItem(key: string) {
        return memory.get(key) ?? null
      },
      async setItem(key: string, value: string) {
        memory.set(key, value)
      },
    }
  }
}

export default storage as typeof AsyncStorage
