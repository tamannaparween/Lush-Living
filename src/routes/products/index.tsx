
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Leaf, Sprout } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { getActiveCategories } from '@/features/categories/services/category.service'
import { getActiveProducts } from '@/features/products/services/product.service'
import type { Product } from '@/features/products/types/product.types'
import { StorefrontHeader } from '@/features/storefront/components/storefront-header'
import { StorefrontFooter } from '@/features/storefront/components/storefront-footer'

export const Route = createFileRoute('/products/')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'customer') {
      throw redirect({ to: '/admin' })
    }
  },
  component: ProductsPage,
})

function ProductImage({ product }: { product: Product }) {
  const image = product.images[0]

  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#EEF3E9]">
      {image ? (
        <img
          src={image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <Sprout className="size-16 text-[#78936D]" strokeWidth={1.2} />
      )}
    </div>
  )
}

function ProductsPage() {
  const products = getActiveProducts()
  const categories = getActiveCategories()

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ??
    'Uncategorized'

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <StorefrontHeader />

      <main>
        {/* Page Heading */}
        <section className="bg-[#F0F4E9] px-4 py-14 text-center sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#285B35]">
              <Leaf className="size-4" />
              Explore Our Collection
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#193D25] sm:text-4xl md:text-5xl">
              All Plants & Garden Essentials
            </h1>

            <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
              Find the perfect plants and essentials to bring more
              greenery into your everyday life.
            </p>
          </div>
        </section>

        {/* Product Listing */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#193D25]">
                Our Products
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Explore our collection of plants and gardening essentials
              </p>
            </div>

            <span className="text-sm font-medium text-stone-600">
              {products.length} Products
            </span>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <Sprout className="mx-auto size-12 text-[#78936D]" />
              <h3 className="mt-4 text-lg font-semibold text-[#193D25]">
                No Products Available
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                New products will be available here soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative">
                    <ProductImage product={product} />

                    {product.featured && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#285B35] px-3 py-1 text-xs font-medium text-white">
                        Featured
                      </span>
                    )}

                    {product.stock === 0 && (
                      <span className="absolute right-3 bottom-3 rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-white">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-medium tracking-wide text-[#78936D] uppercase">
                      {getCategoryName(product.categoryId)}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold text-[#193D25]">
                      {product.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                      {product.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-[#285B35]">
                        {formatPrice(product.price)}
                      </span>

                      {product.compareAtPrice !== undefined &&
                        product.compareAtPrice > product.price && (
                          <span className="text-sm text-stone-400 line-through">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                    </div>

                    <p
                      className={`mt-3 text-xs font-medium ${
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= 5
                            ? 'text-amber-600'
                            : 'text-green-700'
                      }`}
                    >
                      {product.stock === 0
                        ? 'Currently unavailable'
                        : product.stock <= 5
                          ? `Only ${product.stock} left`
                          : 'In Stock'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <StorefrontFooter />
    </div>
  )
}