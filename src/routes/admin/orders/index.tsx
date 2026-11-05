import { createFileRoute } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'

export const Route = createFileRoute('/admin/orders/')({
  component: OrdersPage,
})

function OrdersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Orders</h2>
        <p className="mt-1 text-sm text-[#718075]">
          View and manage your store orders.
        </p>
      </header>

      <section className="rounded-xl border border-[#E8E8DF] bg-white p-6">
        <div className="mb-6">
          <p className="text-sm text-[#718075]">Total Orders</p>
          <p className="mt-1 text-3xl font-semibold">0</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg bg-[#F7F6F0] px-5 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2E9] text-[#315B46]">
            <ShoppingBag size={26} />
          </div>

          <h3 className="mt-4 font-semibold">No orders yet</h3>

          <p className="mt-2 max-w-sm text-sm text-[#718075]">
            Your customer orders will appear here once your store starts
            receiving orders.
          </p>
        </div>
      </section>
    </div>
  )
}