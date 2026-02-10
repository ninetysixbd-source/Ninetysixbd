import { Product } from "@prisma/client"

export type SerializableProduct = Omit<Product, "price" | "salePrice"> & {
    price: number
    salePrice: number | null
    images: string[] // Manually added until Prisma client regeneration
    sizes?: any
    colors?: any
    discountPercentage?: number | null
    category?: { name: string }
}
