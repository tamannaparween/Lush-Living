import { useState } from 'react'
import {
  createFileRoute,
  redirect,
  useNavigate,
  Link,
  useLocation,
  Outlet,
} from '@tanstack/react-router'
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  ShoppingCart,
  Users,
  Settings,
  Leaf,
  LogOut,
  ChevronDown,
  ArrowLeftRight,
  UserRound,
} from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/auth.store'
import { getDemoUserByRole } from '@/features/auth/services/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const { user, isAuthenticated } = useAuthStore.getState()

    if (!isAuthenticated || !user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AdminLayout,
})

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
  { label: 'Products', icon: Package, to: '/admin/products' },
  { label: 'Categories', icon: Tags },
  { label: 'Inventory', icon: Boxes },
  { label: 'Orders', icon: ShoppingCart },
  { label: 'Customers', icon: Users },
  { label: 'Settings', icon: Settings },
]

function AdminLayout() {
  const navigate = useNavigate()
  const pathname = useLocation({
    select: (location) => location.pathname,
  })

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  const handleRoleSwitch = () => {
    if (!user) return

    const targetRole = user.role === 'admin' ? 'customer' : 'admin'
    const targetUser = getDemoUserByRole(targetRole)

    if (!targetUser) return

    setUser(targetUser)
    setIsAccountMenuOpen(false)

    navigate({ to: targetRole === 'admin' ? '/admin' : '/' })
  }

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen bg-[#F7F6F0] text-[#26372D]">
      <aside className="flex w-16 shrink-0 flex-col bg-[#173D30] px-2 py-7 text-white transition-all duration-500 ease-in-out sm:w-20 sm:px-3 md:w-56 md:px-4 lg:w-64 lg:px-5">
        <div className="mb-10 flex items-center justify-center gap-3 md:justify-start">
          <Leaf size={28} className="shrink-0" />
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold">Lush Living</h1>
            <p className="text-xs text-green-200">Admin Panel</p>
          </div>
        </div>

        <p className="mb-3 hidden text-xs font-medium uppercase tracking-wider text-green-300">
          Main Menu
        </p>

        <nav className="flex flex-col gap-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive =
                item.to === '/admin'
                    ? pathname === '/admin'
                    : item.to
                    ? pathname.startsWith(item.to)
                    : false
            return item.to ? (
              <Link
                key={item.label}
                to={item.to}
                title={item.label}
                className={`flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm md:justify-start ${
                  isActive
                    ? 'bg-transparent font-medium text-white'
                    : 'bg-[#426B54] text-green-100 hover:bg-[#527A63]'
                }`}
              >
                <Icon size={19} className="shrink-0" />
                <span className="hidden overflow-hidden whitespace-nowrap transition-all duration-500 md:inline">
                  {item.label}
                </span>
              </Link>
            ) : (
              <div
                key={item.label}
                title={item.label}
              className="flex cursor-not-allowed items-center justify-center gap-3 rounded-lg bg-[#426B54] px-3 py-3 text-sm text-green-100 opacity-80 md:justify-start">
                <Icon size={19} className="shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
              </div>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm text-green-100 transition hover:bg-[#315B46] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:justify-start"
        >
          <LogOut size={19} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-6 md:p-9">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-[#718075]">
              Welcome back, {user?.name}
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAccountMenuOpen((open) => !open)}
              aria-expanded={isAccountMenuOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-lg border border-[#E8E8DF] bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-[#F7F6F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315B46]"
            >
              <UserRound size={18} />
              <span>{user?.name}</span>
              <ChevronDown size={16} />
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-64 rounded-xl border border-[#E8E8DF] bg-white p-3 shadow-lg">
                <div className="border-b border-[#E8E8DF] px-2 pb-3">
                  <p className="font-medium">{user?.name}</p>
                  <p className="mt-1 break-all text-xs text-[#718075]">
                    {user?.id}
                  </p>
                  <p className="mt-1 break-all text-xs text-[#718075]">
                    {user?.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRoleSwitch}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-[#F7F6F0] focus-visible:outline-2 focus-visible:outline-[#315B46]"
                >
                  <ArrowLeftRight size={17} />
                  Switch to User
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-600"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}
