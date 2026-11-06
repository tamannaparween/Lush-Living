import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Leaf, LogOut, Menu, UserRound, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function StorefrontHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    setIsMenuOpen(false)
    logout()
    navigate({ to: '/login' })
  }

  const closeMenu = () => setIsMenuOpen(false)

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
          <a href="#home" className="text-sm font-medium text-stone-700 transition-colors hover:text-green-800">
            Home
          </a>

          <a href="#categories" className="text-sm font-medium text-stone-700 transition-colors hover:text-green-800">
            Categories
          </a>

          <a href="#featured" className="text-sm font-medium text-stone-700 transition-colors hover:text-green-800">
            Featured Products
          </a>
        </nav>

        {/* Customer Account */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm text-stone-700 sm:flex">
            <UserRound className="size-5 text-green-800" />
            <span>{user?.name ?? 'Customer'}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 border-stone-300 text-stone-700 hover:bg-stone-100"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
        <nav className="border-t border-stone-200 bg-white px-4 py-4 shadow-md md:hidden">
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

            <div className="mt-2 border-t border-stone-100 px-4 pt-3 text-sm text-stone-600">
              Signed in as <span className="font-semibold text-green-900">{user?.name ?? 'Customer'}</span>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}