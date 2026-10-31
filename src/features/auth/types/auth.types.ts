export type UserRole = 'admin' | 'customer'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthCredentials {
  email: string
  password: string
}
