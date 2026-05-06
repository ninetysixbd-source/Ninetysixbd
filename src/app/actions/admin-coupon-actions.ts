"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
    const session = await auth()
    if (!session?.user?.id) { // Should also check role
        throw new Error("Unauthorized")
    }
    return session.user
}

export async function createCoupon(data: any) {
    try {
        await requireAdmin()

        const existingCookie = await prisma.coupon.findUnique({
            where: { code: data.code }
        })

        if (existingCookie) {
            return { error: "Coupon code already exists" }
        }

        await prisma.coupon.create({
            data: {
                code: data.code,
                type: data.type, // PERCENTAGE or FIXED
                amount: data.amount,
                minOrderAmount: data.minOrderAmount || 0,
                expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
                usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
                isActive: true
            }
        })

        revalidatePath("/admin/coupons")
        return { success: true }
    } catch (error) {
        console.error("Create Coupon Error:", error)
        return { error: "Failed to create coupon" }
    }
}

export async function deleteCoupon(id: string) {
    try {
        await requireAdmin()

        await prisma.coupon.delete({
            where: { id }
        })

        revalidatePath("/admin/coupons")
        return { success: true }
    } catch (error) {
        console.error("Delete Coupon Error:", error)
        return { error: "Failed to delete coupon" }
    }
}

export async function getCoupons() {
    try {
        await requireAdmin()
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return { coupons }
    } catch (error) {
        return { error: "Failed to fetch coupons" }
    }
}
