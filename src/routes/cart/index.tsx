import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Minus,
  Plus,
  ShoppingBag,
  Sprout,
  Trash2,
} from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCartStore } from "@/features/cart/store/cart.store";
import { getProductById } from "@/features/products/services/product.service";
import { StorefrontHeader } from "@/components/header";
import { StorefrontFooter } from "@/components/footer";

export const Route = createFileRoute("/cart/")({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }

    if (user.role !== "customer") {
      throw redirect({ to: "/admin" });
    }
  },
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const cartProducts = items.flatMap((item) => {
    const product = getProductById(item.productId);

    if (!product || product.status !== "active") {
      return [];
    }

    return [{ ...item, product }];
  });

  const totalItems = cartProducts.length;

  const handleDecrease = (productId: string, quantity: number) => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleIncrease = (
    productId: string,
    quantity: number,
    stock: number,
  ) => {
    if (quantity < stock) {
      updateQuantity(productId, quantity + 1);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <StorefrontHeader />

      <main>
        {/* Page Heading */}
        <section className="bg-[#F0F4E9] px-4 py-12 text-center sm:px-6 md:py-16">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#285B35]">
              <Leaf className="size-4" />
              Your Shopping Bag
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-[#193D25] sm:text-4xl">
              Shopping Cart
            </h1>

            <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
              Review the plants and gardening essentials you've selected.
            </p>
          </div>
        </section>

        {/* Cart Content */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          {cartProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <ShoppingBag
                className="mx-auto size-14 text-[#78936D]"
                strokeWidth={1.2}
              />

              <h2 className="mt-5 text-xl font-semibold text-[#193D25]">
                Your Cart is Empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                You haven't added any products to your cart yet. Explore our
                collection and find something you love.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#285B35] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#193D25]"
              >
                <ArrowLeft className="size-4" />
                Explore Products
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#193D25]">
                    Your Cart Items
                  </h2>

                  <p className="mt-1 text-sm text-stone-500">
                    {totalItems} {totalItems === 1 ? "item" : "items"} in your
                    cart
                  </p>
                </div>

                <Link
                  to="/products"
                  className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#285B35] transition hover:text-[#193D25]"
                >
                  <ArrowLeft className="size-4" />
                  Continue Shopping
                </Link>
              </div>

              <div className="space-y-4">
                {cartProducts.map(({ product, quantity }) => (
                  <article
                    key={product.id}
                    className="flex flex-col gap-5 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                  >
                    {/* Product Image */}
                    <Link
                      to="/products/$slug"
                      params={{ slug: product.slug }}
                      aria-label={`View ${product.name} details`}
                      className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EEF3E9] sm:size-32"
                    >
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="size-full object-cover transition duration-300 hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <Sprout
                          className="size-12 text-[#78936D]"
                          strokeWidth={1.2}
                        />
                      )}
                    </Link>

                    {/* Product Information */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-[#193D25]">
                        <Link
                          to="/products/$slug"
                          params={{ slug: product.slug }}
                          className="transition hover:text-[#78936D]"
                        >
                          {product.name}
                        </Link>
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
                        {product.description}
                      </p>

                      <p className="mt-3 text-sm font-medium text-[#285B35]">
                        {formatPrice(product.price)} per item
                      </p>
                    </div>
                    {/* Quantity and Price */}
                    <div className="flex flex-col items-end justify-center gap-4 border-t border-stone-100 pt-4 sm:min-w-40 sm:border-t-0 sm:pt-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-lg border border-[#DCE5D5]">
                          <button
                            type="button"
                            onClick={() => handleDecrease(product.id, quantity)}
                            disabled={quantity <= 1}
                            aria-label={`Decrease ${product.name} quantity`}
                            className="p-2 text-[#3F5B45] transition hover:bg-[#F0F4E9] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="min-w-8 text-center text-sm font-medium text-[#263D2C]">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleIncrease(
                                product.id,
                                quantity,
                                product.stock,
                              )
                            }
                            disabled={quantity >= product.stock}
                            aria-label={`Increase ${product.name} quantity`}
                            className="p-2 text-[#3F5B45] transition hover:bg-[#F0F4E9] disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="flex items-center gap-1.5 text-sm text-red-600 transition hover:text-red-700"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      </div>

                      <p className="text-lg font-bold text-[#285B35]">
                        {formatPrice(product.price * quantity)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Link
                  to="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#285B35] px-8 py-3 font-semibold text-white transition hover:bg-[#193D25]"
                >
                  Proceed to Checkout
                  <ArrowRight className="size-5" />
                </Link>
              </div>
            </>
          )}
        </section>
      </main>

      <StorefrontFooter />
    </div>
  );
}
