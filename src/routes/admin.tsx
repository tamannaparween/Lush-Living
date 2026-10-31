import { createFileRoute, redirect } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/auth.store'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AdminPlaceholder,
})

function AdminPlaceholder() {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)
    return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">
        Admin Area
      </h1>
      <p>Temporary route placeholder</p>
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