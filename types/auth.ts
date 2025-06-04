export interface User {
  id: number
  name: string
  email: string | null
  phone: string
  address: string | null
  bonusPoints: number
  isAdmin: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone: string
  address?: string
  password: string
}

export interface AuthResponse {
  user: User
  message: string
}

export interface AuthUser {
  id: number
  email: string | null
  isAdmin: boolean
}