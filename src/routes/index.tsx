import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Leaf, Sprout } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { getActiveCategories } from "@/features/categories/services/category.service";
import { getFeaturedProducts } from "@/features/products/services/product.service";
import { StorefrontHeader } from "@/components/header";
import { StorefrontFooter } from "@/components/footer";
import { StorefrontCarousel } from "@/routes/-components/carousel";
import { StorefrontAbout } from "@/routes/-components/about";
import { StorefrontTestimonials } from "@/routes/-components/testimonials";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }

    if (user.role !== "customer") {
      throw redirect({ to: "/admin" });
    }
  },
  component: HomePage,
});

function HomePage() {
  const categories = getActiveCategories();
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <StorefrontHeader />

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="relative isolate h-[600px] overflow-hidden bg-gradient-to-br from-[#F0F4E9] via-[#F8F8F0] to-[#E4EDDC]"
        >
          {/* Hero Background Carousel */}
          <StorefrontCarousel />

          <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {/* Hero Content */}
            <div className="w-full">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#E8EBDD]/85 px-4 py-2 text-sm font-medium text-[#193D25] shadow-sm">
                <Leaf className="size-4" />
                Bring nature into your life
              </span>

              <h1 className="mt-6 max-w-xl text-4xl leading-tight font-bold tracking-tight text-[#F4F0E5] sm:text-5xl lg:text-6xl">
                Bring Nature
                <span className="block text-[#D6E2C8]">Closer to Home</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-[#F0F0E7] sm:text-lg">
                Discover beautiful plants and gardening essentials to create a
                greener, happier living space.
              </p>

              <a
                href="#featured"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#285B35] px-7 py-3.5 font-semibold text-white transition hover:bg-[#1D4729]"
              >
                Explore Collection
                <ArrowRight className="size-5" />
              </a>
            </div>

            {/* Empty space for desktop layout */}
            <div aria-hidden="true" className="hidden md:block" />
          </div>
        </section>

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
                <div
                  key={category.id}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Category Image */}
                  <div className="size-32 overflow-hidden rounded-full bg-[#EEF3E9] ring-4 ring-[#EEF3E9] transition-all duration-300 group-hover:ring-[#C8D8BC] sm:size-40">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  {/* Category Information */}
                  <div className="mt-5 max-w-48">
                    <h3 className="font-semibold text-stone-800 transition-colors group-hover:text-[#6F8F5D]">
                      {category.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-stone-500">
                      {category.description}
                    </p>
                  </div>
                </div>
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
            <div className="relative mb-10">
              <div className="text-center">
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

              {/* See All Products Button */}
              <div className="mt-6 flex justify-center lg:absolute lg:top-1/2 lg:right-0 lg:mt-0 lg:-translate-y-1/2 lg:justify-end">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-[#285B35] px-5 py-2.5 text-sm font-semibold text-[#285B35] transition-colors hover:bg-[#285B35] hover:text-white"
                >
                  See All Products
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="group block overflow-hidden rounded-2xl border border-[#E5EBDD] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285B35]"
                  >
                    {/* Product Image */}
                    <div className="h-56 w-full overflow-hidden bg-[#F7F8F3]">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Sprout
                            className="size-12 text-[#78936D]"
                            strokeWidth={1.2}
                          />
                        </div>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="p-5">
                      <h3 className="font-semibold text-stone-900">
                        {product.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">
                        {product.description}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-lg font-bold text-[#285B35]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>

                        {product.compareAtPrice !== undefined &&
                          product.compareAtPrice > product.price && (
                            <span className="text-sm text-stone-400 line-through">
                              ₹{product.compareAtPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                      </div>

                      <p className="mt-2 text-xs text-stone-500">
                        {product.stock > 0
                          ? "In Stock"
                          : "Currently unavailable"}
                      </p>
                    </div>
                  </Link>
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
  );
}
