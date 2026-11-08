import { useMemo, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Leaf, Search, SlidersHorizontal, Sprout, X } from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { getActiveCategories } from "@/features/categories/services/category.service";
import { getActiveProducts } from "@/features/products/services/product.service";
import type { Product } from "@/features/products/types/product.types";
import { StorefrontHeader } from "@/features/storefront/components/storefront-header";
import { StorefrontFooter } from "@/features/storefront/components/storefront-footer";

export const Route = createFileRoute("/products/")({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }

    if (user.role !== "customer") {
      throw redirect({ to: "/admin" });
    }
  },
  component: ProductsPage,
});

function ProductImage({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#EEF3E9]">
      {image ? (
        <img
          src={image}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Sprout className="size-16 text-[#78936D]" strokeWidth={1.2} />
      )}
    </div>
  );
}

function ProductsPage() {
  const products = getActiveProducts();
  const categories = getActiveCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" || product.categoryId === selectedCategory;

      const matchesMinPrice =
        minPrice === "" || product.price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || product.price <= Number(maxPrice);

      const matchesAvailability =
        availability === "all" ||
        (availability === "in-stock" && product.stock > 0) ||
        (availability === "out-of-stock" && product.stock === 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesAvailability
      );
    });

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    availability,
    sortBy,
  ]);

  const getCategoryName = (categoryId: string) =>
    categories.find((category) => category.id === categoryId)?.name ??
    "Uncategorized";

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setAvailability("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    availability !== "all" ||
    sortBy !== "default";

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
              Find the perfect plants and essentials to bring more greenery into
              your everyday life.
            </p>
          </div>
        </section>

        {/* Product Listing */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#193D25]">
                Our Products
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Explore our collection of plants and gardening essentials
              </p>
            </div>

            <span className="text-sm font-medium text-stone-600">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Product" : "Products"}
            </span>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 rounded-2xl border border-stone-200 bg-white p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-[#285B35]" />
              <h3 className="font-semibold text-[#193D25]">Search & Filters</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
              {/* Search */}
              <div className="xl:col-span-2">
                <label
                  htmlFor="product-search"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Search Products
                </label>

                <div className="relative">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />

                  <input
                    id="product-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name or description"
                    className="h-11 w-full rounded-lg border border-stone-200 bg-[#FAFAF6] pr-3 pl-10 text-sm text-stone-700 outline-none transition focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-11 w-full rounded-lg border border-stone-200 bg-[#FAFAF6] px-3 text-sm text-stone-700 outline-none transition focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                >
                  <option value="all">All Categories</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="xl:col-span-2">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Price Range (₹)
                </label>

                <div className="flex items-center gap-2">
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    max="99999"
                    step="any"
                    value={minPrice}
                    onChange={(event) => setMinPrice(event.target.value)}
                    placeholder="Min"
                    aria-label="Minimum price"
                    className="h-11 w-full min-w-0 rounded-lg border border-stone-200 bg-[#FAFAF6] px-3 text-sm text-stone-700 outline-none transition focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                  />

                  <span className="text-stone-400">-</span>

                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    max="99999"
                    step="any"
                    value={maxPrice}
                    onChange={(event) => setMaxPrice(event.target.value)}
                    placeholder="Max"
                    aria-label="Maximum price"
                    className="h-11 w-full min-w-0 rounded-lg border border-stone-200 bg-[#FAFAF6] px-3 text-sm text-stone-700 outline-none transition focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label
                  htmlFor="availability-filter"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Availability
                </label>

                <select
                  id="availability-filter"
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value)}
                  className="h-11 w-full rounded-lg border border-stone-200 bg-[#FAFAF6] px-3 text-sm text-stone-700 outline-none transition focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Sorting */}
              <div>
                <label
                  htmlFor="sort-products"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Sort By
                </label>

                <select
                  id="sort-products"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-11 w-full rounded-lg border border-stone-200 bg-[#FAFAF6] px-3 text-sm text-stone-700 outline-none transition focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            {/* Sorting and Clear Filters */}
            <div className="mt-5 flex justify-end border-t border-stone-100 pt-5"></div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-medium text-[#285B35] transition hover:bg-[#EEF3E9] sm:self-auto"
              >
                <X className="size-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Product Results */}
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
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <Search className="mx-auto size-12 text-[#78936D]" />
              <h3 className="mt-4 text-lg font-semibold text-[#193D25]">
                No Matching Products
              </h3>
              <p className="mt-2 text-sm text-stone-500">
                Try changing your search or filters to find products.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-[#285B35] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#193D25]"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
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
                          ? "text-red-600"
                          : product.stock <= 5
                            ? "text-amber-600"
                            : "text-green-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Currently unavailable"
                        : product.stock <= 5
                          ? `Only ${product.stock} left`
                          : "In Stock"}
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
  );
}
