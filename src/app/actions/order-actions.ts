"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { trackPurchase } from "@/lib/tracking"

// Helper to check for admin role
async function requireAdmin() {
    const session = await auth()
    if (!session?.user?.id) { // In a real app, also check session.user.role === 'ADMIN'
        throw new Error("Unauthorized: Please sign in")
    }
    return session.user
}

export async function createOrder(data: any) {
    try {
        const { items, userId, coupon, ...orderData } = data

        // ── Validate all product IDs exist in the database ──────────────
        const productIds = items.map((item: any) => item.productId).filter(Boolean)
        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true }
        })
        const existingIds = new Set(existingProducts.map(p => p.id))
        const invalidItems = items.filter((item: any) => !existingIds.has(item.productId))

        if (invalidItems.length > 0) {
            const invalidNames = invalidItems.map((item: any) => item.name).join(", ")
            return {
                error: `The following product(s) are no longer available: ${invalidNames}. Please remove them from your cart and try again.`
            }
        }

        // Calculate initial total from items for validation since we can't fully trust client-side total
        const calculatedSubtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)

        let finalTotal = calculatedSubtotal // This will be the intermediate total after discount, before shipping
        let discountAmount = 0
        let couponCode = null

        // Server-side coupon re-validation
        if (coupon && coupon.code) {
            const dbCoupon = await prisma.coupon.findUnique({
                where: { code: coupon.code }
            })

            if (dbCoupon && dbCoupon.isActive) {
                console.log("Applying coupon:", dbCoupon.code)
                let isValid = true;
                if (dbCoupon.expiresAt && dbCoupon.expiresAt < new Date()) isValid = false;
                if (dbCoupon.usageLimit && dbCoupon.usedCount >= dbCoupon.usageLimit) isValid = false;
                if (dbCoupon.minOrderAmount && calculatedSubtotal < Number(dbCoupon.minOrderAmount)) isValid = false;

                if (isValid) {
                    if (dbCoupon.type === "PERCENTAGE") {
                        discountAmount = (calculatedSubtotal * Number(dbCoupon.amount)) / 100
                    } else {
                        discountAmount = Number(dbCoupon.amount)
                    }

                    // Cap discount
                    if (discountAmount > calculatedSubtotal) discountAmount = calculatedSubtotal

                    // Recalculate intermediate total after discount but before shipping
                    finalTotal = calculatedSubtotal - discountAmount
                    couponCode = dbCoupon.code

                    // Increment usage count
                    await prisma.coupon.update({
                        where: { id: dbCoupon.id },
                        data: { usedCount: { increment: 1 } }
                    })
                }
            }
        } else {
            // If no coupon, intermediate total is just subtotal
            finalTotal = calculatedSubtotal
        }

        // Shipping Fee Logic
        const shippingFee = orderData.shippingMethod === "inside_dhaka" ? 80 : 130
        finalTotal += shippingFee

        // Use the calculated total, or at least validate the passed total matches reasonably
        // For now, let's use the calculated finalTotal to be safe and accurate

        const order = await prisma.order.create({
            data: {
                customerName: orderData.customerName,
                email: orderData.email,
                phone: orderData.phone,
                address: orderData.address,
                city: orderData.city,
                district: orderData.district || null,
                upazila: orderData.upazila || null,
                zipCode: orderData.zipCode || "",
                paymentMethod: orderData.paymentMethod || "COD",
                status: "PENDING",
                subtotal: calculatedSubtotal,
                discountAmount: discountAmount,
                shippingFee: shippingFee,
                couponCode: couponCode,
                totalAmount: finalTotal, // Use server-calculated total
                userId: userId || null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        size: item.size || null,
                        color: item.color || null
                    }))
                }
            }
        })

        revalidatePath("/admin/orders")
        revalidatePath("/account")

        // Fire server-side tracking events (non-blocking)
        trackPurchase(
            finalTotal,
            items.map((item: any) => ({
                id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            })),
            {
                email: orderData.email,
                phone: orderData.phone,
                name: orderData.customerName,
            }
        ).catch(() => { }) // Never let tracking break checkout

        return { success: true, orderId: order.id, orderNumber: order.orderNumber }
    } catch (error) {
        console.error("Order Creation Error:", error)
        return { error: error instanceof Error ? error.message : "Failed to create order (Unknown Error)" }
    }
}

// Admin Action: Update Order Status
export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await requireAdmin()

        const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
        if (!validStatuses.includes(status)) {
            return { error: "Invalid status" }
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) {
            return { error: "Order not found" }
        }

        if (order.status === "CANCELLED") {
            return { error: "Cannot modify a cancelled order" }
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        })

        revalidatePath(`/admin/orders/${orderId}`)
        revalidatePath("/admin/orders")
        return { success: true }
    } catch (error) {
        console.error("Update Status Error:", error)
        return { error: "Failed to update order status" }
    }
}

// Admin Action: Cancel Order
export async function cancelOrder(orderId: string) {
    try {
        await requireAdmin()

        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) {
            return { error: "Order not found" }
        }

        if (order.status === "DELIVERED") {
            return { error: "Cannot cancel a delivered order" }
        }

        if (order.status === "CANCELLED") {
            return { error: "Order is already cancelled" }
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
        })

        revalidatePath(`/admin/orders/${orderId}`)
        revalidatePath("/admin/orders")
        return { success: true }
    } catch (error) {
        console.error("Cancel Order Error:", error)
        return { error: "Failed to cancel order" }
    }
}

// User Action: Cancel Own Order
export async function cancelMyOrder(orderId: string) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return { error: "Unauthorized" }
        }

        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) {
            return { error: "Order not found" }
        }

        if (order.userId !== session.user.id) {
            return { error: "Unauthorized access to order" }
        }

        if (order.status !== "PENDING") {
            return { error: "Cannot cancel order that is already being processed" }
        }

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
        })

        revalidatePath("/account/orders")
        return { success: true }
    } catch (error) {
        console.error("Cancel My Order Error:", error)
        return { error: "Failed to cancel order" }
    }
}

// Admin Action: Delete Order permanently from database
export async function deleteOrder(orderId: string) {
    try {
        await requireAdmin()

        const order = await prisma.order.findUnique({ where: { id: orderId } })
        if (!order) {
            return { error: "Order not found" }
        }

        // Delete order items first (no cascade set in schema)
        await prisma.orderItem.deleteMany({
            where: { orderId: orderId },
        })

        // Delete the order
        await prisma.order.delete({
            where: { id: orderId },
        })

        revalidatePath("/admin/orders")
        revalidatePath("/account/orders")
        return { success: true }
    } catch (error) {
        console.error("Delete Order Error:", error)
        return { error: "Failed to delete order" }
    }
}
