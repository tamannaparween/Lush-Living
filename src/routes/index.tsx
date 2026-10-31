import { createFileRoute, redirect } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/auth.store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'customer') {
      throw redirect({ to: '/admin' })
    }
  },
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  return (
    <main className="min-h-screen bg-stone-50">
      <h1 className="text-4xl font-bold text-green-900">
        Lush Living
      </h1>
      <button
        type="button"
        onClick={() => {
          logout()
          navigate({ to: '/login' })
        }}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
        Logout
      </button>
    </main>
  )
}