import { useNavigate, createFileRoute, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { getActiveCategories } from '@/features/categories/services/category.service'
import { addProduct } from '@/features/products/services/product.service'
import {
  productSchema,
  type ProductFormValues,
} from '@/features/products/schemas/product.schema'
import type { Product } from '@/features/products/types/product.types'

export const Route = createFileRoute('/admin/products/add')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AddProductPage,
})

function AddProductPage() {
  const navigate = useNavigate()
  const categories = getActiveCategories()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stock: 0,
      sku: '',
      status: 'draft',
      featured: false,
    },
  })

  function onSubmit(values: ProductFormValues) {
    const now = new Date().toISOString()

    const product: Product = {
      ...values,
      id: crypto.randomUUID(),
      slug: values.name.toLowerCase().trim().replace(/\s+/g, '-'),
      images: [],
      createdAt: now,
      updatedAt: now,
    }

    addProduct(product)
    navigate({ to: '/admin/products' })
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

        <h2 className="text-2xl font-semibold">Add Product</h2>
        <p className="mt-1 text-sm text-[#718075]">
          Add a new product to your store.
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
              placeholder="Enter product name"
              className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"              />
          </FormField>

          <FormField label="Description" error={errors.description?.message}>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Describe your product..."
              className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46] resize-none"
            />
          </FormField>

          <FormField label="Category" error={errors.categoryId?.message}>
            <select {...register('categoryId')} className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]">
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
                placeholder="e.g. LL-IND-011"
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
            <select {...register('status')} className="w-full rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]">
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
            Save Product
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