import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Leaf,
  LoaderCircle,
  MapPin,
  PackageCheck,
  ShoppingBag,
  X,
} from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { useCartStore } from "@/features/cart/store/cart.store";
import {
  getProductById,
  getProducts,
  saveProducts,
} from "@/features/products/services/product.service";
import type { Product } from "@/features/products/types/product.types";
import { StorefrontHeader } from "@/components/header";
import { StorefrontFooter } from "@/components/footer";

export const Route = createFileRoute("/checkout/")({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated || !user) {
      throw redirect({ to: "/login" });
    }

    if (user.role !== "customer") {
      throw redirect({ to: "/admin" });
    }
  },
  component: RouteComponent,
});

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface DemoOrder {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    address: string;
    mobile: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: "demo-card";
  status: "placed";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function RouteComponent() {
  const user = useAuthStore((state) => state.user);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const [paymentError, setPaymentError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState<DemoOrder | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const cartProducts = items.flatMap((item) => {
    const product = getProductById(item.productId);

    if (!product || product.status !== "active") {
      return [];
    }

    return [{ ...item, product }];
  });

  const totalAmount = cartProducts.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const hasUnavailableProducts = cartProducts.length !== items.length;

  const hasStockIssue = cartProducts.some(
    (item) => item.quantity > item.product.stock,
  );

  const handlePlaceOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentError("");

    if (name.trim().length < 2) {
      setPaymentError("Please enter a valid name.");
      return;
    }

    if (address.trim().length < 8) {
      setPaymentError("Please enter your complete delivery address.");
      return;
    }

    if (mobile.length !== 10) {
      setPaymentError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (cardNumber.length !== 16) {
      setPaymentError("Please enter a valid 16-digit card number.");
      return;
    }

    if (cartProducts.length === 0 || hasUnavailableProducts) {
      setPaymentError(
        "Some products in your cart are unavailable. Please review your cart.",
      );
      return;
    }

    if (hasStockIssue) {
      setPaymentError(
        "Some products have insufficient stock. Please update your cart quantity.",
      );
      return;
    }

    setIsModalOpen(true);
    setIsProcessing(true);

    // Demo payment processing: wait for 3 seconds before confirmation.
    timerRef.current = setTimeout(() => {
      try {
        const currentProducts = getProducts();

        // Check product availability and stock again before placing the order.
        const hasInvalidItem = items.some((item) => {
          const product = currentProducts.find(
            (currentProduct) => currentProduct.id === item.productId,
          );

          return (
            !product ||
            product.status !== "active" ||
            product.stock < item.quantity
          );
        });

        if (hasInvalidItem) {
          setIsModalOpen(false);
          setIsProcessing(false);
          setPaymentError(
            "Product availability has changed. Please review your cart.",
          );
          return;
        }

        const orderItems: OrderItem[] = items.map((item) => {
          const product = currentProducts.find(
            (currentProduct) => currentProduct.id === item.productId,
          ) as Product;

          return {
            productId: product.id,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
            image: product.images[0] ?? "",
          };
        });

        const newOrder: DemoOrder = {
          id: `LL-${Date.now()}`,
          createdAt: new Date().toISOString(),
          customer: {
            name: name.trim(),
            address: address.trim(),
            mobile,
          },
          items: orderItems,
          total: orderItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
          ),
          paymentMethod: "demo-card",
          status: "placed",
        };

        // Save the demo order in LocalStorage.
        const existingOrders = localStorage.getItem("lush-living-demo-orders");
        const savedOrders: DemoOrder[] = existingOrders
          ? JSON.parse(existingOrders)
          : [];

        localStorage.setItem(
          "lush-living-demo-orders",
          JSON.stringify([...savedOrders, newOrder]),
        );

        // Reduce product stock after successful order placement.
        const updatedProducts = currentProducts.map((product) => {
          const orderedItem = items.find(
            (item) => item.productId === product.id,
          );

          if (!orderedItem) {
            return product;
          }

          return {
            ...product,
            stock: product.stock - orderedItem.quantity,
            updatedAt: new Date().toISOString(),
          };
        });

        saveProducts(updatedProducts);

        clearCart();
        setOrder(newOrder);
        setIsProcessing(false);
      } catch {
        setIsModalOpen(false);
        setIsProcessing(false);
        setPaymentError(
          "Something went wrong while placing your order. Please try again.",
        );
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <StorefrontHeader />

      <main>
        {/* Page Heading */}
        <section className="bg-[#F0F4E9] px-4 py-10 text-center sm:px-6 md:py-12">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#285B35]">
              <Leaf className="size-4" />
              Almost There!
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#193D25] sm:text-4xl">
              Checkout Page
            </h1>

            <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base">
              Complete your details and review your order.
            </p>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
          {cartProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
              <ShoppingBag
                className="mx-auto size-14 text-[#78936D]"
                strokeWidth={1.2}
              />

              <h2 className="mt-5 text-xl font-semibold text-[#193D25]">
                Your Cart is Empty
              </h2>

              <p className="mt-2 text-sm text-stone-500">
                Add some products before proceeding to checkout.
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
            <form onSubmit={handlePlaceOrder}>
              <div className="grid gap-7 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8">
                {/* User Details Form */}
                <div className="rounded-2xl border border-stone-200 p-5 sm:p-7">
                  <div className="mb-7">
                    <div className="flex items-center gap-2 text-[#285B35]">
                      <MapPin className="size-5" />
                      <h2 className="text-xl font-semibold text-[#193D25]">
                        User Details
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-stone-500">
                      Enter your details for delivery.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="checkout-name"
                        className="mb-2 block text-sm font-medium text-stone-700"
                      >
                        Full Name
                      </label>

                      <input
                        id="checkout-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        minLength={2}
                        className="w-full rounded-xl border border-stone-300 bg-[#FAFAF6] px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label
                        htmlFor="checkout-address"
                        className="mb-2 block text-sm font-medium text-stone-700"
                      >
                        Delivery Address
                      </label>

                      <textarea
                        id="checkout-address"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Enter your complete address"
                        autoComplete="street-address"
                        required
                        minLength={8}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-stone-300 bg-[#FAFAF6] px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                      />
                    </div>

                    {/* Mobile */}
                    <div>
                      <label
                        htmlFor="checkout-mobile"
                        className="mb-2 block text-sm font-medium text-stone-700"
                      >
                        Mobile Number
                      </label>

                      <input
                        id="checkout-mobile"
                        type="tel"
                        inputMode="numeric"
                        value={mobile}
                        onChange={(event) =>
                          setMobile(
                            event.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        placeholder="Enter 10-digit mobile number"
                        autoComplete="tel"
                        required
                        maxLength={10}
                        className="w-full rounded-xl border border-stone-300 bg-[#FAFAF6] px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                      />
                    </div>

                    {/* Card Details */}
                    <div>
                      <label
                        htmlFor="checkout-card"
                        className="mb-2 block text-sm font-medium text-stone-700"
                      >
                        Card Details
                      </label>

                      <div className="relative">
                        <CreditCard className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-stone-400" />

                        <input
                          id="checkout-card"
                          type="text"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(event) =>
                            setCardNumber(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16),
                            )
                          }
                          placeholder="1234 5678 9012 3456"
                          autoComplete="cc-number"
                          required
                          maxLength={16}
                          className="w-full rounded-xl border border-stone-300 bg-[#FAFAF6] py-3 pr-4 pl-12 text-sm tracking-wider text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#78936D] focus:ring-2 focus:ring-[#78936D]/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="rounded-2xl border border-stone-200 p-5 sm:p-7">
                  <div className="mb-7">
                    <div className="flex items-center gap-2 text-[#285B35]">
                      <PackageCheck className="size-5" />
                      <h2 className="text-xl font-semibold text-[#193D25]">
                        Order Details
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-stone-500">
                      Review your selected products.
                    </p>
                  </div>

                  {/* Products */}
                  <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
                    {cartProducts.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-xl bg-[#FAFAF6] p-3"
                      >
                        <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-[#EEF3E9]">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="size-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <Leaf className="size-7 text-[#78936D]" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold text-[#193D25]">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-xs text-stone-500">
                            Quantity: {quantity}
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#285B35]">
                            {formatPrice(product.price)} each
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-[#193D25]">
                          {formatPrice(product.price * quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Total Amount */}
                  <div className="mt-7 rounded-xl border border-[#DCE5D5] bg-[#F0F4E9] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-stone-600">
                        Total Amount
                      </span>

                      <span className="text-2xl font-bold text-[#285B35]">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-stone-500">
                      Delivery charges: Free
                    </p>
                  </div>

                  {/* Pay Button */}
                  <button
                    type="submit"
                    disabled={
                      isProcessing || hasUnavailableProducts || hasStockIssue
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#285B35] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#193D25] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CreditCard className="size-4" />
                    Pay Now
                  </button>

                  {hasUnavailableProducts && (
                    <p className="mt-3 text-center text-sm text-red-600">
                      Some cart products are no longer available. Please review
                      your cart.
                    </p>
                  )}

                  {hasStockIssue && (
                    <p className="mt-3 text-center text-sm text-red-600">
                      A product quantity exceeds the available stock.
                    </p>
                  )}

                  {paymentError && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                      {paymentError}
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}
        </section>
      </main>

      <StorefrontFooter />

      {/* Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8"
          >
            {!isProcessing && (
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close payment confirmation"
                className="absolute top-4 right-4 rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="size-5" />
              </button>
            )}

            {isProcessing ? (
              <>
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#F0F4E9]">
                  <LoaderCircle className="size-10 animate-spin text-[#285B35]" />
                </div>

                <h2
                  id="payment-modal-title"
                  className="mt-6 text-2xl font-bold text-[#193D25]"
                >
                  Processing Payment
                </h2>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Please wait while we process your demo order. Do not close
                  this window.
                </p>
              </>
            ) : order ? (
              <>
                <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[#E8F5E9]">
                  <CheckCircle2 className="size-11 text-[#285B35]" />
                </div>

                <h2
                  id="payment-modal-title"
                  className="mt-6 text-2xl font-bold text-[#193D25]"
                >
                  Order Placed Successfully!
                </h2>

                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Thank you for shopping with Lush Living. Your order has been
                  placed successfully.
                </p>

                <div className="mt-6 rounded-xl bg-[#F0F4E9] p-4 text-left">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-stone-500">Order ID</span>
                    <span className="text-sm font-semibold text-[#193D25]">
                      {order.id}
                    </span>
                  </div>

                  <div className="my-3 border-t border-[#DCE5D5]" />

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 flex-1 text-stone-600">
                          {item.name} × {item.quantity}
                        </span>

                        <span className="shrink-0 font-medium text-[#193D25]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="my-3 border-t border-[#DCE5D5]" />

                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-[#193D25]">
                      Total Paid
                    </span>

                    <span className="text-lg font-bold text-[#285B35]">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#285B35] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#193D25]"
                >
                  <Leaf className="size-4" />
                  Back to Home
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
