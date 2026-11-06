import { Leaf } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function StorefrontFooter() {
  return (
    <footer className="border-t border-stone-200 bg-[#F1F3EB]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <Leaf className="size-7 text-green-800" />

              <span className="text-xl font-bold text-green-900">
                Lush Living
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-6 text-stone-600">
              Bring nature closer to home with beautiful plants and
              everything you need to grow.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 font-semibold text-stone-900">
              Shop
            </h3>

            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <a href="#home" className="transition hover:text-green-800">
                  Home
                </a>
              </li>
              <li>
                <a href="#categories" className="transition hover:text-green-800">
                  Categories
                </a>
              </li>
              <li>
                <a href="#featured" className="transition hover:text-green-800">
                  Featured Products
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-4 font-semibold text-stone-900">
              Customer Support
            </h3>

            <ul className="space-y-3 text-sm text-stone-600">
              <li>Shipping Information</li>
              <li>Returns & Refunds</li>
              <li>Order Assistance</li>
              <li>FAQs</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-stone-900">
              Contact Us
            </h3>

            <p className="text-sm leading-6 text-stone-600">
              Have questions about our plants or products? We are
              here to help you grow.
            </p>

            <p className="mt-3 text-sm font-medium text-green-900">
              Lush Living Customer Care
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Lush Living. All rights reserved.
        </div>
      </div>
    </footer>
  )
}