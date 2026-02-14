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

    try {
        await prisma.product.create({
            data: {
                ...parsed.data,
                inStock: parsed.data.inStock ?? true,
            },
        })
    } catch (error) {
        console.error("Product creation failed:", error)
        return { error: "Failed to create product. Slug might be duplicate." }
    }

    revalidatePath("/admin/products")
    redirect("/admin/products")
}

export async function updateProduct(id: string, data: ProductFormValues) {
    await requireAdmin()

    const parsed = productSchema.safeParse(data)

    if (!parsed.success) {
        return { error: "Invalid form data" }
    }

    try {
        await prisma.product.update({
            where: { id },
            data: {
                ...parsed.data,
                inStock: parsed.data.inStock ?? true,
            },
        })
    } catch (error) {
        console.error("Product update failed:", error)
        return { error: "Failed to update product. Slug might be duplicate." }
    }

    revalidatePath("/admin/products")
    redirect("/admin/products")
}

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}
