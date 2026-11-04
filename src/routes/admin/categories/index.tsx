import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus, Trash2,} from 'lucide-react'
import { 
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory, 
} from '@/features/categories/services/category.service'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/admin/categories/')({
  component: CategoriesPage,
})

function CategoriesPage() {
    const [categories, setCategories] = useState(getCategories)
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')

    function handleCloseForm() {
        setIsFormOpen(false)
        setEditingCategoryId(null)
        setName('')
        setDescription('')
        setImage('')
    }   

  function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${name}"?`,
    )

    if (!confirmed) return

    deleteCategory(id)
    setCategories(getCategories())
    }

    function handleAddCategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const trimmedName = name.trim()
        const trimmedDescription = description.trim()

        if (!trimmedName || !trimmedDescription) return

        const now = new Date().toISOString()

        if (editingCategoryId) {
            const existingCategory = categories.find(
                (category) => category.id === editingCategoryId,
            )

            if (!existingCategory) return

            updateCategory({
                ...existingCategory,
                name: trimmedName,
                slug: trimmedName.toLowerCase().replace(/\s+/g, '-'),
                description: trimmedDescription,
                image: image.trim(),
                updatedAt: now,
            })
        } else {
            addCategory({
                id: crypto.randomUUID(),
                name: trimmedName,
                slug: trimmedName.toLowerCase().replace(/\s+/g, '-'),
                description: trimmedDescription,
                image: image.trim(),
                isActive: true,
                createdAt: now,
                updatedAt: now,
            })
    }

        setCategories(getCategories())
        setName('')
        setDescription('')
        setImage('')
        setIsFormOpen(false)
    }

    function handleEditCategory(id: string) {
    const category = categories.find((item) => item.id === id)

    if (!category) return

    setEditingCategoryId(id)
    setName(category.name)
    setDescription(category.description)
    setImage(category.image)
    setIsFormOpen(true)
}

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-semibold">Categories</h2>
            <p className="mt-1 text-sm text-[#718075]">
            Manage your product categories.
            </p>
        </div>

        <button
            type="button"
            onClick={() => {
                handleCloseForm()
                setIsFormOpen(true)
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#315B46] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#244A38]"
        >
            <Plus size={18} />
            Add Category
        </button>
        </div>
        <Dialog.Root
            open={isFormOpen}
            onOpenChange={(open) => {
                if (!open) handleCloseForm()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingCategoryId
                            ? 'Update the details of this category.'
                            : 'Fill in the details to create a new category.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAddCategory} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Category name"
                        required
                        minLength={2}
                        className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
                    />

                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Category description"
                        required
                        minLength={10}
                        rows={3}
                        className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
                    />

                    <input
                        type="text"
                        value={image}
                        onChange={(event) => setImage(event.target.value)}
                        placeholder="Image path (optional)"
                        className="w-full rounded-lg border border-[#E8E8DF] px-3 py-2.5 text-sm outline-none focus:border-[#315B46]"
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseForm}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            Save Category
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog.Root>

      <div className="rounded-xl border border-[#E8E8DF] bg-white">
        <div className="border-b border-[#E8E8DF] p-5">
          <h3 className="font-semibold">Category List</h3>
          <p className="mt-1 text-xs text-[#718075]">
            {categories.length} categories found
          </p>
        </div>

        <div className="divide-y divide-[#E8E8DF]">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-3 p-5"
            >
              <div>
                <p className="text-sm font-semibold">{category.name}</p>
                <p className="mt-1 text-xs text-[#718075]">
                  {category.description}
                </p>
              </div>

              <span className="text-xs text-[#718075]">
                {category.isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                type="button"
                onClick={() => handleEditCategory(category.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#E8E8DF] px-3 py-2 text-xs font-medium text-[#315B46] hover:bg-[#F4F7F3]"
            >
                Edit
            </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id, category.name)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                <Trash2 size={15} />
                Delete
                </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}