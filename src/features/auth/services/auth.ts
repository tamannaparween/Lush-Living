import type { AuthCredentials, AuthUser } from '../types/auth.types'

const DEMO_USERS = [
  {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@lushliving.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    id: 'customer-001',
    name: 'Customer',
    email: 'user@lushliving.com',
    password: 'User@123',
    role: 'customer',
  },
] as const

export async function login(
  credentials: AuthCredentials,
): Promise<AuthUser> {
  const email = credentials.email.trim().toLowerCase()

  const user = DEMO_USERS.find(
    (demoUser) =>
      demoUser.email === email &&
      demoUser.password === credentials.password,
  )

  if (!user) {
    throw new Error('Invalid email or password')
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}