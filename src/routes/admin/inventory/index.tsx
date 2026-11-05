import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  Boxes,
  Package,
  AlertTriangle,
  CircleAlert,
  Search,
  Save,
} from 'lucide-react'

import {
  getProducts,
  updateProduct,
} from '@/features/products/services/product.service'
import { getCategories } from '@/features/categories/services/category.service'

export const Route = createFileRoute('/admin/inventory/')({
  component: InventoryPage,
})

function InventoryPage() {
  const [products, setProducts] = useState(getProducts)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({})

  const categories = getCategories()

  const totalStock = products.reduce(
    (total, product) => total + product.stock,
    0,
  )

  const lowStockProducts = products.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  )

  const outOfStockProducts = products.filter(
    (product) => product.stock === 0,
  )

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && product.stock > 5) ||
      (stockFilter === 'low-stock' &&
        product.stock > 0 &&
        product.stock <= 5) ||
      (stockFilter === 'out-of-stock' && product.stock === 0)

    return matchesSearch && matchesStock
  })

  function handleUpdateStock(product: (typeof products)[number]) {
    const draft = stockDrafts[product.id]

    if (draft === undefined || draft.trim() === '') return

    const newStock = Number(draft)

    if (!Number.isInteger(newStock) || newStock < 0) return

    updateProduct({
      ...product,
      stock: newStock,
      updatedAt: new Date().toISOString(),
    })

    setProducts(getProducts())

    setStockDrafts((previous) => {
      const updated = { ...previous }
      delete updated[product.id]
      return updated
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Inventory</h2>
        <p className="mt-1 text-sm text-[#718075]">
          Monitor and manage your product stock.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Products"
          value={products.length}
          icon={Package}
        />
        <SummaryCard
          label="Total Stock Units"
          value={totalStock}
          icon={Boxes}
        />
        <SummaryCard
          label="Low Stock"
          value={lowStockProducts.length}
          icon={AlertTriangle}
        />
        <SummaryCard
          label="Out of Stock"
          value={outOfStockProducts.length}
          icon={CircleAlert}
        />
      </section>

      <section className="overflow-hidden rounded-xl border border-[#E8E8DF] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E8DF] p-5">
          <div>
            <h3 className="font-semibold">Stock Overview</h3>
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
                placeholder="Search product or SKU..."
                className="w-full min-w-0 bg-transparent py-2.5 text-sm outline-none"
              />
            </div>

            <select
              value={stockFilter}
              onChange={(event) => setStockFilter(event.target.value)}
              className="rounded-lg border border-[#E8E8DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[#E8E8DF]">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const category = categories.find(
                (item) => item.id === product.categoryId,
              )

              const draft = stockDrafts[product.id]
              const draftValue =
                draft === undefined ? product.stock : Number(draft)

              const isValidDraft =
                draft !== undefined &&
                draft.trim() !== '' &&
                Number.isInteger(draftValue) &&
                draftValue >= 0

              const stockStatus =
                product.stock === 0
                  ? 'Out of Stock'
                  : product.stock <= 5
                    ? 'Low Stock'
                    : 'In Stock'

              return (
                <div
                  key={product.id}
                  className="flex flex-wrap items-center gap-4 p-5 transition hover:bg-[#FAFAF7]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EEF2E9] text-[#315B46]">
                    <Package size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-[#718075]">
                      {product.sku} · {category?.name ?? 'Uncategorized'}
                    </p>
                  </div>

                  <div className="min-w-24">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.stock === 0
                          ? 'bg-red-50 text-red-700'
                          : product.stock <= 5
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {stockStatus}
                    </span>
                    <p className="mt-2 text-xs text-[#718075]">
                      {product.stock} units
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={draft ?? product.stock}
                      onChange={(event) =>
                        setStockDrafts((previous) => ({
                          ...previous,
                          [product.id]: event.target.value,
                        }))
                      }
                      aria-label={`Update stock for ${product.name}`}
                      className="w-20 rounded-lg border border-[#E8E8DF] px-2 py-2 text-sm outline-none focus:border-[#315B46]"
                    />

                    <button
                      type="button"
                      disabled={!isValidDraft || draftValue === product.stock}
                      onClick={() => handleUpdateStock(product)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#315B46] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#244A38] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Save size={14} />
                      Save
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-10 text-center">
              <Package size={32} className="mx-auto text-[#9AA59C]" />
              <p className="mt-3 text-sm font-medium">No products found</p>
              <p className="mt-1 text-xs text-[#718075]">
                Try changing your search or stock filter.
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