import { z } from "zod"

export const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().min(0, "Price must be positive"),
    salePrice: z.coerce.number().min(0).optional().nullable(),
    discountPercentage: z.coerce.number().min(0).max(100, "Discount must be between 0-100").optional().nullable(),
    stock: z.coerce.number().min(0, "Stock must be positive"),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    sizes: z.object({
        available: z.array(z.string()),
        unavailable: z.array(z.string()),
    }).optional(),
    colors: z.object({
        available: z.array(z.string()),
        unavailable: z.array(z.string()),
    }).optional(),
})

export type ProductFormValues = z.infer<typeof productSchema>
