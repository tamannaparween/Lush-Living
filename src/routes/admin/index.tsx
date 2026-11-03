
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'

import { getProducts } from '@/features/products/services/product.service'
import StatCard from './-components/stat-card'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const products = getProducts()
  const lowStockProducts = products.filter((product) => product.stock <= 5)

  const stats = [
    { label: 'Total Revenue', value: '—', note: 'Orders module pending' },
    { label: 'Total Orders', value: '—', note: 'Orders module pending' },
    { label: 'Total Products', value: products.length.toString(), note: 'Products in store' },
    { label: 'Total Customers', value: '—', note: 'Customer data pending' },
  ]

  return (
    <>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <p className="mt-1 text-sm text-[#718075]">
          Here's what's happening with your store today.
        </p>
      </header>

      <section>
        <StatCard stats={stats} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-[#E8E8DF] bg-white p-6 xl:col-span-2">
          <h3 className="font-semibold">Recent Orders</h3>
          <p className="mt-1 text-sm text-[#718075]">
            Your latest store activity will appear here.
          </p>
          <div className="mt-6 rounded-lg bg-[#F7F6F0] p-5 text-center text-sm text-[#718075]">
            No order data available yet.
          </div>
        </article>

        <article className="rounded-xl border border-[#E8E8DF] bg-white p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle size={19} className="text-amber-600" />
            <h3 className="font-semibold">Low Stock Alert</h3>
          </div>
          <p className="mt-1 text-sm text-[#718075]">
            Products with 5 or fewer items in stock.
          </p>

          <div className="mt-5 space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F6F0] p-3"
                >
                  <span className="text-sm font-medium">{product.name}</span>
                  <span className="shrink-0 text-xs text-amber-700">
                    {product.stock} left
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-lg bg-[#F7F6F0] p-5 text-center text-sm text-[#718075]">
                No low-stock products.
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  )
}
