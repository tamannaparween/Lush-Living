import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Plus,
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  Trash2,
} from 'lucide-react'

import { getProducts, deleteProduct, } from '@/features/products/services/product.service'
import { getCategories } from '@/features/categories/services/category.service'

export const Route = createFileRoute('/admin/products/')({
  component: ProductsPage,
})

function ProductsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [products, setProducts] = useState(getProducts)
  function handleDelete(id: string, name: string) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${name}"?`,
  )

  if (!confirmed) return

  deleteProduct(id)
  setProducts(getProducts())
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

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 rounded-lg bg-[#315B46] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244A38]"
        >
          <Plus size={18} />
          Add Product
        </Link>
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

                  <Link
                    to="/admin/products/$productId/edit"
                    params={{ productId: product.id }}
                    className="rounded-lg border border-[#E8E8DF] px-3 py-2 text-xs font-medium transition hover:bg-[#F7F6F0]"
                  >
                    Edit
                  </Link>
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
    </div>
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