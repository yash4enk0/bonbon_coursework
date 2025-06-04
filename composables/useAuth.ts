import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types/auth'

const user = ref<User | null>(null)
const isLoading = ref(false)

export const useAuth = () => {
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin || false)

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    isLoading.value = true
    try {
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })
      user.value = response.user
      return response
    } catch (error: any) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData): Promise<AuthResponse> => {
    isLoading.value = true
    try {
      const response = await $fetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: userData
      })
      user.value = response.user
      return response
    } catch (error: any) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST'
      })
      user.value = null
      // Перенаправити на головну після виходу
      await navigateTo('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Навіть якщо помилка, очистити локальний стан
      user.value = null
      await navigateTo('/')
    }
  }

  const fetchUser = async (): Promise<void> => {
    try {
      const response = await $fetch<{ user: User }>('/api/auth/me')
      user.value = response.user
    } catch (error) {
      user.value = null
    }
  }

  const requireAuth = (): void => {
    if (!isLoggedIn.value) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }
  }

  const requireAdmin = (): void => {
    requireAuth()
    if (!isAdmin.value) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin access required'
      })
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    isAdmin,
    isLoading: readonly(isLoading),
    login,
    register,
    logout,
    fetchUser,
    requireAuth,
    requireAdmin
  }
}