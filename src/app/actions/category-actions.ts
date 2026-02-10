"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required")
})

export async function createCategory(data: z.infer<typeof categorySchema>) {
    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) return { error: "Invalid data" }

    try {
        await prisma.category.create({
            data: parsed.data
        })
        revalidatePath("/admin/categories")
        return { success: true }
    } catch (e) {
        return { error: "Failed to create category" }
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } })
        revalidatePath("/admin/categories")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete category" }
    }
}
