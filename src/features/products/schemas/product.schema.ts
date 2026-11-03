import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().trim().min(1, 'SKU is required'),
  status: z.enum(['active', 'draft', 'archived']),
  featured: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>