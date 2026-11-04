import { useNavigate, createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { getActiveCategories } from '@/features/categories/services/category.service'
import {
  getProductById,
  updateProduct,
} from '@/features/products/services/product.service'
import {
  productSchema,
  type ProductFormValues,
} from '@/features/products/schemas/product.schema'

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
  const navigate = useNavigate()
  const { productId } = Route.useParams()
  const product = getProductById(productId)
  const categories = getActiveCategories()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          categoryId: product.categoryId,
          stock: product.stock,
          sku: product.sku,
          status: product.status,
          featured: product.featured,
        }
      : undefined,
  })

  function onSubmit(values: ProductFormValues) {
    if (!product) return

    updateProduct({
      ...product,
      ...values,
      slug: values.name.toLowerCase().trim().replace(/\s+/g, '-'),
      updatedAt: new Date().toISOString(),
    })

    navigate({ to: '/admin/products' })
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Product not found</h2>
        <button
          type="button"
          onClick={() => navigate({ to: '/admin/products' })}
          className="text-sm text-[#315B46] hover:underline"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate({ to: '/admin/products' })}
          className="mb-4 flex items-center gap-2 text-sm text-[#718075] hover:text-[#315B46]"
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        <h2 className="text-2xl font-semibold">Edit Product</h2>
        <p className="mt-1 text-sm text-[#718075]">
          Update your product details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl space-y-6 rounded-xl border border-[#E8E8DF] bg-white p-6"
      >
        <div className="space-y-4">
          <h3 className="font-semibold">Basic Information</h3>

          <FormField label="Product Name" error={errors.name?.message}>
            <input
              {...register('name')}
              className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
            />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full resize-none rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
            />
          </FormField>

          <FormField label="Category" error={errors.categoryId?.message}>
            <select
              {...register('categoryId')}
              className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="border-t border-[#E8E8DF] pt-5">
          <h3 className="mb-4 font-semibold">Pricing & Inventory</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Price (₹)" error={errors.price?.message}>
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
              />
            </FormField>

            <FormField
              label="Compare at Price (₹)"
              error={errors.compareAtPrice?.message}
            >
              <input
                type="number"
                min="0"
                step="0.01"
                {...register('compareAtPrice', {
                  setValueAs: (value) =>
                    value === '' ? undefined : Number(value),
                })}
                className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
              />
            </FormField>

            <FormField label="SKU" error={errors.sku?.message}>
              <input
                {...register('sku')}
                className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
              />
            </FormField>

            <FormField label="Stock Quantity" error={errors.stock?.message}>
              <input
                type="number"
                min="0"
                {...register('stock', { valueAsNumber: true })}
                className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
              />
            </FormField>
          </div>
        </div>

        <div className="border-t border-[#E8E8DF] pt-5">
          <h3 className="mb-4 font-semibold">Product Settings</h3>

          <FormField label="Status" error={errors.status?.message}>
            <select
              {...register('status')}
              className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </FormField>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4 accent-[#315B46]"
            />
            Mark as featured product
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#E8E8DF] pt-5">
          <button
            type="button"
            onClick={() => navigate({ to: '/admin/products' })}
            className="rounded-lg border border-[#E8E8DF] px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-[#315B46] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#244A38]"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  )
}

function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}