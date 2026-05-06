"use server"

import { prisma } from "@/lib/prisma"
import { productSchema, ProductFormValues } from "@/lib/validators/product-schema"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/auth"

async function requireAdmin() {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required")
    }
    return session
}

export async function createProduct(data: ProductFormValues) {
    await requireAdmin()

    const parsed = productSchema.safeParse(data)

    if (!parsed.success) {
        return { error: "Invalid form data" }
    }

    // Check if a product with the same name already exists
    const existingProduct = await prisma.product.findFirst({
        where: { name: { equals: parsed.data.name, mode: 'insensitive' } },
    })
    if (existingProduct) {
        return { error: "A product with this name already exists." }
    }

    try {
        await prisma.product.create({
            data: {
                ...parsed.data,
                inStock: parsed.data.inStock ?? true,
                isFeatured: parsed.data.isFeatured ?? false,
                isSpecialDeal: parsed.data.isSpecialDeal ?? false,
            },
        })
    } catch (error) {
        console.error("Product creation failed:", error)
        return { error: "Failed to create product. Slug might be duplicate." }
    }

    revalidatePath("/")
    revalidatePath("/products")
    revalidatePath("/admin/products")
    redirect("/admin/products")
}

export async function updateProduct(id: string, data: ProductFormValues) {
    await requireAdmin()

    const parsed = productSchema.safeParse(data)

    if (!parsed.success) {
        return { error: "Invalid form data" }
    }

    // Check if another product with the same name already exists (exclude current product)
    const existingProduct = await prisma.product.findFirst({
        where: {
            name: { equals: parsed.data.name, mode: 'insensitive' },
            id: { not: id },
        },
    })
    if (existingProduct) {
        return { error: "A product with this name already exists." }
    }

    try {
        await prisma.product.update({
            where: { id },
            data: {
                ...parsed.data,
                inStock: parsed.data.inStock ?? true,
                isFeatured: parsed.data.isFeatured ?? false,
                isSpecialDeal: parsed.data.isSpecialDeal ?? false,
            },
        })
    } catch (error) {
        console.error("Product update failed:", error)
        return { error: "Failed to update product. Slug might be duplicate." }
    }

    revalidatePath("/")
    revalidatePath("/products")
    revalidatePath("/admin/products")
    redirect("/admin/products")
}

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: {
            children: true
        }
    })
}

export async function deleteProduct(id: string) {
    await requireAdmin()

    try {
        // Use a transaction to ensure both operations succeed or fail together
        await prisma.$transaction(async (tx) => {
            // Delete related order items first (no onDelete cascade in schema)
            await tx.orderItem.deleteMany({
                where: { productId: id },
            })

            // Delete the product
            await tx.product.delete({
                where: { id },
            })
        })

        revalidatePath("/admin/products")
        revalidatePath("/")
        revalidatePath("/products")

        return { success: true }
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Unknown error"
        console.error("Product deletion failed:", message)
        return { error: "Failed to delete product. " + message }
    }
}

export async function toggleSpecialDeal(id: string, isSpecialDeal: boolean) {
    await requireAdmin()

    try {
        await prisma.product.update({
            where: { id },
            data: { isSpecialDeal },
        })

        revalidatePath("/")
        revalidatePath("/admin/products")
        return { success: true }
    } catch (error) {
        console.error("Failed to toggle special deal:", error)
        return { error: "Failed to update special deal status" }
    }
}
