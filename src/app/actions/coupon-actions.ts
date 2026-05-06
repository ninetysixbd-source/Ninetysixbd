"use server"

import { prisma } from "@/lib/prisma"

export async function validateCoupon(code: string, cartTotal: number) {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code },
        })

        if (!coupon) {
            return { error: "Invalid coupon code" }
        }

        if (!coupon.isActive) {
            return { error: "Coupon is inactive" }
        }

        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return { error: "Coupon has expired" }
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { error: "Coupon usage limit reached" }
        }

        if (coupon.minOrderAmount && cartTotal < Number(coupon.minOrderAmount)) {
            return { error: `Minimum order amount of ${coupon.minOrderAmount} required` }
        }

        let discountAmount = 0
        if (coupon.type === "PERCENTAGE") {
            discountAmount = (cartTotal * Number(coupon.amount)) / 100
        } else {
            discountAmount = Number(coupon.amount)
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal
        }

        return {
            success: true,
            discountAmount,
            code: coupon.code,
            type: coupon.type,
            amount: Number(coupon.amount)
        }

    } catch (error) {
        console.error("Coupon Validation Error:", error)
        return { error: "Failed to validate coupon" }
    }
}
