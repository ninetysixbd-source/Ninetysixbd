"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const offerSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    backgroundColor: z.string().default("bg-blue-100"),
    image: z.string().optional(),
    expiresAt: z.string().optional() // received as string from input type="date"
})

export async function createOffer(data: z.infer<typeof offerSchema>) {
    const parsed = offerSchema.safeParse(data)
    if (!parsed.success) return { error: "Invalid data" }

    try {
        await prisma.offer.create({
            data: {
                title: parsed.data.title,
                description: parsed.data.description,
                backgroundColor: parsed.data.backgroundColor,
                image: parsed.data.image,
                expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
            }
        })
        revalidatePath("/admin/deals")
        revalidatePath("/") // Update homepage
        return { success: true }
    } catch (e) {
        return { error: "Failed to create offer" }
    }
}

export async function deleteOffer(id: string) {
    try {
        await prisma.offer.delete({ where: { id } })
        revalidatePath("/admin/deals")
        revalidatePath("/")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete offer" }
    }
}
