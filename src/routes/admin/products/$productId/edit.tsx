import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/store/auth.store'

export const Route = createFileRoute('/admin/products/$productId/edit')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: EditProductPage,
})

function EditProductPage() {
  return <div>Edit Product</div>
}