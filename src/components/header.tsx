import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Leaf,
  LogOut,
  Menu,
  UserRound,
  X,
  ChevronDown,
  ArrowLeftRight,
  ShoppingCart,
} from "lucide-react";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { getDemoUserByRole } from "@/features/auth/services/auth";
import { useCartStore } from "@/features/cart/store/cart.store";

export function StorefrontHeader() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const cartItemsCount = useCartStore((state) => state.items.length);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate({ to: "/login" });
  };

  const handleRoleSwitch = () => {
    if (!user) return;

    const targetUser = getDemoUserByRole("admin");

    if (!targetUser) return;

    setUser(targetUser);
    setIsAccountMenuOpen(false);
    setIsMenuOpen(false);

    navigate({ to: "/admin" });
  };

  const closeMenu = () => setIsMenuOpen(false);
  useEffect(() => {
    if (!isMenuOpen && !isAccountMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, isAccountMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <Leaf className="size-7 text-green-800" />

          <span className="text-xl font-bold tracking-tight text-green-900 sm:text-2xl">
            Lush Living
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-stone-700 transition-colors hover:text-green-800"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-stone-700 transition-colors hover:text-green-800"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm font-medium text-stone-700 transition-colors hover:text-green-800"
          >
            <ShoppingCart className="size-4" />
            Cart
            {cartItemsCount > 0 && (
              <span className="flex min-w-5 items-center justify-center rounded-full bg-[#285B35] px-1.5 py-0.5 text-xs font-semibold text-white">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Customer Account */}
        <div className="flex items-center gap-3">
          {isAccountMenuOpen && (
            <button
              type="button"
              aria-label="Close account menu"
              onClick={() => setIsAccountMenuOpen(false)}
              className="fixed inset-0 z-40 cursor-default bg-black/20"
            />
          )}
          <div className="relative z-50 hidden sm:block">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 shadow-sm transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800"
            >
              <UserRound className="size-5 text-green-800" />
              <span>{user?.name ?? "Customer"}</span>
              <ChevronDown className="size-4" />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-stone-200 bg-white p-3 shadow-lg">
                <div className="border-b border-stone-200 px-2 pb-3">
                  <p className="font-medium text-stone-800">{user?.name}</p>
                  <p className="mt-1 break-all text-xs text-stone-500">
                    {user?.id}
                  </p>
                  <p className="mt-1 break-all text-xs text-stone-500">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRoleSwitch}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-green-800"
                >
                  <ArrowLeftRight className="size-4" />
                  Switch to Admin
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            className="flex size-9 items-center justify-center rounded-lg text-stone-700 transition hover:bg-stone-100 md:hidden"
          >
            {isMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}

      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="fixed inset-x-0 top-20 bottom-0 z-40 cursor-default bg-black/30 md:hidden"
          />

          <nav className="absolute top-20 right-0 left-0 z-50 border-t border-stone-200 bg-white px-4 py-4 shadow-md md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              <a
                href="#home"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-800"
              >
                Home
              </a>

              <a
                href="#categories"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-800"
              >
                Categories
              </a>

              <a
                href="#featured"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-800"
              >
                Featured Products
              </a>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-800"
              >
                <ShoppingCart className="size-4" />
                Cart
                {cartItemsCount > 0 && (
                  <span className="flex min-w-5 items-center justify-center rounded-full bg-[#285B35] px-1.5 py-0.5 text-xs font-semibold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <div className="mt-3 border-t border-stone-200 px-4 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#193D25]">
                  <UserRound className="size-5" />
                  {user?.name ?? "Customer"}
                </div>

                <p className="mt-2 break-all text-xs text-stone-500">
                  {user?.id}
                </p>

                <p className="mt-1 break-all text-xs text-stone-500">
                  {user?.email}
                </p>

                <button
                  type="button"
                  onClick={handleRoleSwitch}
                  className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-stone-700 transition hover:bg-green-50 hover:text-green-800"
                >
                  <ArrowLeftRight className="size-4" />
                  Switch to Admin
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
