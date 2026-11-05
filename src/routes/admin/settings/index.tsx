import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { 
    Save, 
    Store, 
    Bell, 
    SlidersHorizontal,
    CheckCircle2, 
} from 'lucide-react'

import {
  getStorageItem,
  setStorageItem,
} from '@/lib/storage/local-storage'

export const Route = createFileRoute('/admin/settings/')({
  component: SettingsPage,
})

const STORAGE_KEY = 'lush-living-settings'

type StoreSettings = {
  storeName: string
  email: string
  phone: string
  orderNotifications: boolean
  lowStockNotifications: boolean
}

const defaultSettings: StoreSettings = {
  storeName: 'Lush Living',
  email: '',
  phone: '',
  orderNotifications: true,
  lowStockNotifications: true,
}

function SettingsPage() {
  const [savedSettings, setSavedSettings] = useState<StoreSettings>(() =>
    getStorageItem<StoreSettings>(STORAGE_KEY, defaultSettings),
  )

    const [settings, setSettings] = useState<StoreSettings>(savedSettings)

    const [saved, setSaved] = useState(false)

    const [showValidation, setShowValidation] = useState(false)

    useEffect(() => {
        if (!saved) return

        const timeout = window.setTimeout(() => {
            setSaved(false)
        }, 3000)

        return () => window.clearTimeout(timeout)
    }, [saved])

    const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings)
    const emailError =
        showValidation &&
        settings.email.trim() !== '' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(settings.email.trim())
            ? 'Please enter a valid email address.'
            : ''

    const phoneError =
        showValidation &&
        settings.phone.trim() !== '' &&
        !/^[6-9]\d{9}$/.test(settings.phone.trim())
            ? 'Please enter a valid phone number.'
            : ''

    const isFormValid =
        settings.email.trim() === '' ||
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(settings.email.trim())
            ? (
                settings.phone.trim() === '' ||
                /^[6-9]\d{9}$/.test(settings.phone.trim())
            )
        : false

  function handleChange(
    field: keyof StoreSettings,
    value: string | boolean,
    ) {
        if (field === 'phone' && typeof value === 'string') {
            value = value.replace(/\D/g, '').slice(0, 10)
        }

        setSettings((previous) => ({
            ...previous,
            [field]: value,
        }))

        setSaved(false)
        setShowValidation(false)
    }

  function handleSave() {
    setShowValidation(true)

    if (!isFormValid) {
        setSaved(false)
        return
    }

    setStorageItem(STORAGE_KEY, settings)
    setSavedSettings(settings)
    setSaved(true)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Settings</h2>
          <p className="mt-1 text-sm text-[#718075]">
            Manage your store preferences and notifications.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="inline-flex items-center gap-2 rounded-lg bg-[#315B46] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244A38] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#315B46]"
        >
          <Save size={16} />
          Save Changes
        </button>
      </header>

      <section className="rounded-xl border border-[#E8E8DF] bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <Store size={20} className="text-[#315B46]" />
          <div>
            <h3 className="font-semibold">Store Information</h3>
            <p className="text-xs text-[#718075]">
              Basic information about your store.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Store Name
            <input
              value={settings.storeName}
              onChange={(event) =>
                handleChange('storeName', event.target.value)
              }
              className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2.5 font-normal outline-none focus:border-[#315B46]"
              placeholder="Enter store name"
            />
          </label>

          <label className="space-y-2 text-sm font-medium">
            Store Email
            <input
                type="email"
                value={settings.email}
                onChange={(event) =>
                handleChange('email', event.target.value)
                }
                className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2.5 font-normal outline-none focus:border-[#315B46]"
                placeholder="Enter store email"
            />
            {emailError && (
                <p className="text-xs text-red-600">{emailError}</p>
            )}
            </label>

          <label className="space-y-2 text-sm font-medium">
            Contact Number
            <input
                type="tel"
                value={settings.phone}
                onChange={(event) =>
                handleChange('phone', event.target.value)
                }
                className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2.5 font-normal outline-none focus:border-[#315B46]"
                placeholder="Enter contact number"
            />
            {phoneError && (
                <p className="text-xs text-red-600">{phoneError}</p>
            )}
            </label>  
        </div>
      </section>

      <section className="rounded-xl border border-[#E8E8DF] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <SlidersHorizontal size={20} className="text-[#315B46]" />
          <div>
            <h3 className="font-semibold">Store Preferences</h3>
            <p className="text-xs text-[#718075]">
              Default currency for your store.
            </p>
          </div>
        </div>

        <div className="max-w-sm">
          <label className="space-y-2 text-sm font-medium">
            Currency
            <input
              value="INR (₹)"
              readOnly
              className="w-full rounded-lg border border-[#E8E8DF] bg-[#F7F6F0] px-3 py-2.5 text-sm outline-none"
            />
          </label>
          <p className="mt-2 text-xs text-[#718075]">
            Currency is fixed for this demo store.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-[#E8E8DF] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <Bell size={20} className="text-[#315B46]" />
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-xs text-[#718075]">
              Manage your store notification preferences.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E8E8DF]">
          <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">Order Notifications</p>
              <p className="mt-1 text-xs text-[#718075]">
                Receive alerts for new customer orders.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderNotifications}
              onChange={(event) =>
                handleChange('orderNotifications', event.target.checked)
              }
              className="h-4 w-4 accent-[#315B46]"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-medium">Low Stock Notifications</p>
              <p className="mt-1 text-xs text-[#718075]">
                Receive alerts when product stock is low.
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.lowStockNotifications}
              onChange={(event) =>
                handleChange('lowStockNotifications', event.target.checked)
              }
              className="h-4 w-4 accent-[#315B46]"
            />
          </label>
        </div>
      </section>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#D5E5D8] bg-white px-5 py-4 shadow-lg">
            <CheckCircle2 size={21} className="text-[#315B46]" />
            <div>
            <p className="text-sm font-semibold text-[#315B46]">
                Saved Successfully
            </p>
            <p className="mt-1 text-xs text-[#718075]">
                Your settings have been updated.
            </p>
            </div>
        </div>
        )}
    </div>
  )
}