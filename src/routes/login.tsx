import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/login-form'
import { useAuthStore } from '@/features/auth/store/auth.store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (isAuthenticated && user) {
      throw redirect({
        to: user.role === 'admin' ? '/admin' : '/',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-md space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Lush Living
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  )
}
