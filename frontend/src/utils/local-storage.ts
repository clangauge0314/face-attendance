const TOKEN_STORAGE_KEY = 'access_token'

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  } catch (error) {
    console.error('Failed to save token to localStorage:', error)
  }
}

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to read token from localStorage:', error)
    return null
  }
}

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to remove token from localStorage:', error)
  }
}

