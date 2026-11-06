import { createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowRight, Leaf, Sprout } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { getActiveCategories } from '@/features/categories/services/category.service'
import { getFeaturedProducts } from '@/features/products/services/product.service'
import { StorefrontHeader } from '@/features/storefront/components/storefront-header'
import { StorefrontFooter } from '@/features/storefront/components/storefront-footer'
import { StorefrontCarousel } from '@/features/storefront/components/storefront-carousel'
import { StorefrontAbout } from '@/features/storefront/components/storefront-about'
import { StorefrontTestimonials } from '@/features/storefront/components/storefront-testimonials'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'customer') {
      throw redirect({ to: '/admin' })
    }
  },
  component: HomePage,
})

function HomePage() {
  const categories = getActiveCategories()
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <StorefrontHeader />

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="overflow-hidden bg-gradient-to-br from-[#F0F4E9] via-[#F8F8F0] to-[#E4EDDC]"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28 lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-green-800 shadow-sm">
                <Leaf className="size-4" />
                Bring nature into your life
              </span>

              <h1 className="mt-6 max-w-xl text-4xl leading-tight font-bold tracking-tight text-[#193D25] sm:text-5xl lg:text-6xl">
                Bring Nature
                <span className="block text-[#668653]">
                  Closer to Home
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
                Discover beautiful plants and gardening essentials
                to create a greener, happier living space.
              </p>

              <a
                href="#featured"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#285B35] px-7 py-3.5 font-semibold text-white transition hover:bg-[#1D4729]"
              >
                Explore Collection
                <ArrowRight className="size-5" />
              </a>
            </div>

            {/* CSS-based Botanical Illustration */}
            <div className="relative flex min-h-64 items-center justify-center sm:min-h-80">
              <div className="absolute size-64 rounded-full bg-[#D8E6CC] blur-2xl sm:size-80" />

              <div className="relative flex size-56 items-center justify-center rounded-full border border-white/70 bg-white/40 shadow-xl backdrop-blur-sm sm:size-72">
                <div className="flex size-40 items-center justify-center rounded-full bg-[#E8F0E1] sm:size-52">
                  <Sprout
                    className="size-28 text-[#47764B] sm:size-36"
                    strokeWidth={1.2}
                  />
                </div>
              </div>

              <span className="absolute bottom-5 left-4 rounded-xl bg-white/90 px-4 py-3 text-sm font-medium text-green-900 shadow-md sm:bottom-8 sm:left-8">
                Grow something beautiful
              </span>

              <Leaf className="absolute top-5 right-8 size-9 rotate-45 text-[#79966B]" />
              <Leaf className="absolute right-4 bottom-12 size-7 -rotate-45 text-[#9CAF8C]" />
            </div>
          </div>
        </section>

        {/* Plant Image Carousel */}
        <StorefrontCarousel />   

        {/* About Lush Living */}
        <StorefrontAbout /> 

        {/* Categories */}
        <section
          id="categories"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold tracking-widest text-green-700 uppercase">
              Explore our collection
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#193D25] sm:text-4xl">
              Shop by Category
            </h2>

            <p className="mt-3 text-stone-600">
              Find the perfect additions for your green space.
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href="#featured"
                  className="group rounded-2xl border border-[#E6EBDD] bg-white p-6 text-center transition hover:-translate-y-1 hover:border-[#A8BE9A] hover:shadow-lg"
                >
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#EEF3E9] transition group-hover:bg-[#DFEBD7]">
                    <Sprout
                      className="size-8 text-[#52764A]"
                      strokeWidth={1.4}
                    />
                  </div>

                  <h3 className="mt-4 font-semibold text-stone-800">
                    {category.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">
                    {category.description}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-8 text-center text-stone-500">
              No categories available right now.
            </p>
          )}
        </section>

        {/* Featured Products */}
        <section id="featured" className="bg-[#F0F4EA] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-sm font-semibold tracking-widest text-green-700 uppercase">
                Handpicked for you
              </span>

              <h2 className="mt-3 text-3xl font-bold text-[#193D25] sm:text-4xl">
                Featured Products
              </h2>

              <p className="mt-3 text-stone-600">
                Bring home something fresh and beautiful.
              </p>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-2xl border border-[#E5EBDD] bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-[#E9F0E2] to-[#D5E4CC]">
                      <div className="flex size-28 items-center justify-center rounded-full bg-white/50">
                        <Sprout
                          className="size-16 text-[#52764A]"
                          strokeWidth={1.2}
                        />
                      </div>

                      {product.stock === 0 && (
                        <span className="absolute top-3 right-3 rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-white">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-stone-900">
                        {product.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-lg font-bold text-[#285B35]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>

                        {product.compareAtPrice !== undefined &&
                          product.compareAtPrice > product.price && (
                            <span className="text-sm text-stone-400 line-through">
                              ₹{product.compareAtPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                      </div>

                      <p className="mt-2 text-xs text-stone-500">
                        {product.stock > 0
                          ? 'In Stock'
                          : 'Currently unavailable'}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-white p-8 text-center text-stone-500">
                No featured products available right now.
              </p>
            )}
          </div>
        </section>

        {/* Customer Testimonials */}
        <StorefrontTestimonials />  

      </main>

      <StorefrontFooter />
    </div>
  )
}