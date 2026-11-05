import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters'),

  description: z.string().trim().min(10, 'Description must be at least 10 characters'),

  price: z
  .number({ error: 'Please enter a valid number' })
  .positive('Price must be greater than 0')
  .max(99999, 'Price cannot exceed 99999'),

  compareAtPrice: z
    .number()
    .min(0, 'Compare at price cannot be negative')
    .max(99999, 'Compare at price cannot exceed 99999')
    .optional(),

  categoryId: z.string().min(1, 'Please select a category'),

  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(100, 'Stock cannot exceed 100'),

  sku: z
    .string()
    .trim()
    .min(1, 'SKU is required')
    .refine(
      (value) => value.split(/\s+/).length < 50,
      'SKU must be less than 50 words',
    ),

  status: z.enum(['active', 'draft', 'archived']),

  featured: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productSchema>