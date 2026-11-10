import { useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  ShoppingCart,
  Sprout,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getActiveCategories } from "@/features/categories/services/category.service";
import { getProductBySlug } from "@/features/products/services/product.service";
import { StorefrontHeader } from "@/components/header";
import { StorefrontFooter } from "@/components/footer";
import { useCartStore } from "@/features/cart/store/cart.store";

export const Route = createFileRoute("/products/$slug")({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }

    if (user.role !== "customer") {
      throw redirect({ to: "/admin" });
    }
  },
  component: ProductDetailsPage,
});

function ProductDetailsPage() {
  const { slug } = Route.useParams();
  const product = getProductBySlug(slug);
  const categories = getActiveCategories();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const [cartMessage, setCartMessage] = useState("");

  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);

  const cartItem = items.find((item) => item.productId === product?.id);

  const cartQuantity = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    if (cartQuantity >= product.stock) {
      setCartMessage("You have already added the available stock.");
      return;
    }

    addItem(product.id, 1);
    setCartMessage(`${product.name} added to your cart successfully!`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  const categoryName = product
    ? (categories.find((category) => category.id === product.categoryId)
        ?.name ?? "Uncategorized")
    : "";

  const selectedImage = product?.images[selectedImageIndex];

  if (!product || product.status !== "active") {
    return (
      <div className="min-h-screen bg-[#FAFAF6]">
        <StorefrontHeader />

        <main className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
          <Sprout className="size-16 text-[#78936D]" strokeWidth={1.2} />

          <h1 className="mt-5 text-2xl font-bold text-[#193D25] sm:text-3xl">
            Product Not Found
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
            This product may have been removed or is currently unavailable.
          </p>

          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#285B35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#193D25]"
          >
            <ArrowLeft className="size-4" />
            Back to Products
          </Link>
        </main>

        <StorefrontFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <StorefrontHeader />

      <main>
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition hover:text-[#285B35]"
          >
            <ArrowLeft className="size-4" />
            Back to Products
          </Link>
        </div>

        {/* Product Details */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* Product Images */}
          <div>
            <div className="relative mx-auto flex aspect-square w-full max-w-[480px] items-center justify-center overflow-hidden rounded-2xl bg-[#EEF3E9]">
              {" "}
              {selectedImage && !imageError ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="size-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Sprout className="size-24 text-[#78936D]" strokeWidth={1.2} />
              )}
              {product.featured && (
                <span className="absolute top-4 left-4 rounded-full bg-[#285B35] px-4 py-2 text-xs font-medium text-white">
                  Featured
                </span>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setImageError(false);
                    }}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                    className={`size-16 overflow-hidden rounded-lg border-2 bg-[#EEF3E9] transition ${
                      selectedImageIndex === index
                        ? "border-[#285B35]"
                        : "border-transparent hover:border-[#78936D]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm font-medium tracking-wide text-[#78936D] uppercase">
              <Leaf className="size-4" />
              {categoryName}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#193D25] sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-[#285B35]">
                {formatPrice(product.price)}
              </span>

              {product.compareAtPrice !== undefined &&
                product.compareAtPrice > product.price && (
                  <>
                    <span className="text-lg text-stone-400 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>

                    <span className="rounded-full bg-[#EEF3E9] px-3 py-1 text-xs font-semibold text-[#285B35]">
                      {Math.round(
                        ((product.compareAtPrice - product.price) /
                          product.compareAtPrice) *
                          100,
                      )}
                      % OFF
                    </span>
                  </>
                )}
            </div>

            {/* Stock Status Badge */}
            <div className="mt-4">
              {product.stock === 0 ? (
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  In Stock
                </span>
              )}
            </div>

            <div className="my-7 border-t border-stone-200" />

            {/* Description */}
            <p className="text-sm leading-7 text-stone-600">
              {product.description}
            </p>

            {/* Quantity Selector */}

            {/* Add to Cart */}
            {/* Cart Action */}
            {cartQuantity > 0 ? (
              <Link
                to="/cart"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#285B35] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#193D25] sm:w-fit"
              >
                <ShoppingCart className="size-5" />
                Go to Cart
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#285B35] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#193D25] disabled:cursor-not-allowed disabled:bg-stone-400 sm:w-fit"
              >
                <ShoppingCart className="size-5" />
                {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            )}

            {cartMessage && (
              <p
                role="status"
                className="mt-3 text-sm font-medium text-[#285B35]"
              >
                {cartMessage}
              </p>
            )}

            <p className="mt-6 text-xs leading-6 text-stone-400">
              Bring a little more nature into your everyday space with Lush
              Living.
            </p>
          </div>
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
