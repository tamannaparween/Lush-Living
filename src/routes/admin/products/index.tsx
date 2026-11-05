import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Plus,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  getProducts,
  deleteProduct,
  addProduct,
  updateProduct,
} from '@/features/products/services/product.service'

import {
  getCategories,
  getActiveCategories,
} from '@/features/categories/services/category.service'

import {
  productSchema,
  type ProductFormValues,
} from '@/features/products/schemas/product.schema'

import type { Product } from '@/features/products/types/product.types'

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const defaultProductValues: Partial<ProductFormValues> = {
    name: '',
    description: '',
    price: undefined,
    categoryId: '',
    stock: 0,
    sku: '',
    status: 'draft',
    featured: false,
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ProductFormValues>
  
  ({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  })

  const [products, setProducts] = useState(getProducts)

  function handleDelete(id: string, name: string) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${name}"?`,
  )

  if (!confirmed) return

  deleteProduct(id)
  setProducts(getProducts())
}

  function handleOpenAdd() {
    setEditingProduct(null)
    reset(defaultProductValues)
    setIsFormOpen(true)
  }

  function handleOpenEdit(product: Product) {
    setEditingProduct(product)

    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      categoryId: product.categoryId,
      stock: product.stock,
      sku: product.sku,
      status: product.status,
      featured: product.featured,
    })

    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setIsFormOpen(false)
    setEditingProduct(null)
    reset(defaultProductValues)
  }

  function onSubmit(values: ProductFormValues) {
    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...values,
        slug: values.name.toLowerCase().trim().replace(/\s+/g, '-'),
        updatedAt: new Date().toISOString(),
      })
    } else {
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
    }

    setProducts(getProducts())
    handleCloseForm()
  }

  const categories = getCategories()

  const filteredProducts = products.filter((product) => {
  const matchesSearch =
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())

  const matchesStatus =
    statusFilter === 'all' || product.status === statusFilter

  return matchesSearch && matchesStatus
})

  const activeCount = products.filter(
    (product) => product.status === 'active',
  ).length

  const lowStockCount = products.filter(
    (product) => product.stock <= 5,
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Products</h2>
          <p className="mt-1 text-sm text-[#718075]">
            Manage your store products and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-lg bg-[#315B46] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244A38]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Products"
          value={products.length}
          icon={Package}
        />
        <SummaryCard
          label="Active Products"
          value={activeCount}
          icon={CheckCircle2}
        />
        <SummaryCard
          label="Low Stock"
          value={lowStockCount}
          icon={AlertTriangle}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E8E8DF] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E8DF] p-5">
          <div>
            <h3 className="font-semibold">Product List</h3>
            <p className="mt-1 text-xs text-[#718075]">
              {filteredProducts.length} products found
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#E8E8DF] px-3 sm:w-64">
              <Search size={17} className="shrink-0 text-[#718075]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or SKU..."
                className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none placeholder:text-[#9AA59C]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#E8E8DF]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const category = categories.find(
                (item) => item.id === product.categoryId,
              )

              return (
                <div
                  key={product.id}
                  className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-[#FAFAF7]"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EEF2E9] text-[#315B46]">
                    <Package size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[#718075]">
                      {product.sku} · {category?.name ?? 'Uncategorized'}
                    </p>
                  </div>

                  <div className="min-w-20">
                    <p className="text-sm font-medium">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p className="mt-1 text-xs text-[#718075]">Price</p>
                  </div>

                  <div className="min-w-20">
                    <p
                      className={`text-sm font-medium ${
                        product.stock <= 5 ? 'text-amber-700' : ''
                      }`}
                    >
                      {product.stock}
                    </p>
                    <p className="mt-1 text-xs text-[#718075]">In stock</p>
                  </div>

                  <div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        product.status === 'active'
                          ? 'bg-green-50 text-green-700'
                          : product.status === 'draft'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(product)}
                    className="rounded-lg border border-[#E8E8DF] px-3 py-2 text-xs font-medium transition hover:bg-[#F7F6F0]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product.id, product.name)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              )
            })
          ) : (
            <div className="p-10 text-center">
              <Package size={32} className="mx-auto text-[#9AA59C]" />
              <p className="mt-3 text-sm font-medium">No products found</p>
              <p className="mt-1 text-xs text-[#718075]">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </div>
      </section>
      <Dialog.Root
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseForm()
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>

            <DialogDescription>
              {editingProduct
                ? 'Update the details of your product.'
                : 'Add a new product to your store.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ProductFormField label="Product Name" error={errors.name?.message}>
                <input
                  {...register('name')}
                  className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                  placeholder="Enter product name"
                />
              </ProductFormField>

              <ProductFormField label="Category" error={errors.categoryId?.message}>
                <select
                  {...register('categoryId')}
                  className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                >
                  <option value="">Select category</option>
                  {getActiveCategories().map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </ProductFormField>
            </div>

            <ProductFormField label="Description" error={errors.description?.message}>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                placeholder="Enter product description"
              />
            </ProductFormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <ProductFormField label="Price (₹)" error={errors.price?.message}>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="₹ 0.00"
                  maxLength={8}
                  {...register('price')}
                  onChange={(event) => {
                    const value = limitPriceInput(event.target.value)

                    event.target.value = value

                    setValue(
                      'price',
                      value === '' ? (undefined as unknown as number) : Number(value),
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                  className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                />
              </ProductFormField>

              <ProductFormField
                label="Compare At Price (₹)"
                error={errors.compareAtPrice?.message}
              >
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="₹ 0.00"
                  maxLength={8}
                  {...register('compareAtPrice')}
                  onChange={(event) => {
                    const value = limitPriceInput(event.target.value)

                    event.target.value = value

                    setValue(
                      'compareAtPrice',
                      value === '' ? undefined : Number(value),
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                  className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                />
              </ProductFormField>

              <ProductFormField label="SKU" error={errors.sku?.message}>
                <input
                  {...register('sku')}
                  className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                  placeholder="Enter SKU"
                />
              </ProductFormField>

              <ProductFormField label="Stock">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  placeholder="Enter stock (0–100)"
                  {...register('stock')}
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, '').slice(0, 3)

                    if (value !== '' && Number(value) > 100) {
                      event.target.value = String(getValues('stock') ?? 0)
                      return
                    }

                    event.target.value = value

                    setValue('stock', value === '' ? 0 : Number(value), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                  className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
                />
              </ProductFormField>
            </div>

            <ProductFormField label="Status" error={errors.status?.message}>
              <select
                {...register('status')}
                className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2 text-sm outline-none focus:border-[#315B46]"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </ProductFormField>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                {...register('featured')}
                className="h-4 w-4 accent-[#315B46]"
              />
              Featured Product
            </label>

            <DialogFooter>
              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-lg border border-[#E8E8DF] px-4 py-2 text-sm font-medium hover:bg-[#F7F6F0]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-[#315B46] px-4 py-2 text-sm font-medium text-white hover:bg-[#244A38]"
              >
                {editingProduct ? 'Update Product' : 'Save Product'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog.Root>
    </div>
  )
}

function limitPriceInput(value: string) {
  let sanitized = value.replace(/[^\d.]/g, '')

  const decimalIndex = sanitized.indexOf('.')

  if (decimalIndex !== -1) {
    sanitized =
      sanitized.slice(0, decimalIndex + 1) +
      sanitized.slice(decimalIndex + 1).replace(/\./g, '')
  }

  const [integerPart, decimalPart] = sanitized.split('.')

  const limitedInteger = integerPart.slice(0, 5)

  if (decimalIndex === -1) {
    return limitedInteger
  }

  return `${limitedInteger}.${(decimalPart ?? '').slice(0, 2)}`
}

function ProductFormField({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      {label}
      {children}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </label>
  )
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: typeof Package
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#E8E8DF] bg-white p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF2E9] text-[#315B46]">
        <Icon size={21} />
      </div>
      <div>
        <p className="text-sm text-[#718075]">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </div>
    </div>
  )
}