"use server"

import { trackAddToCart, trackInitiateCheckout, trackViewContent } from "@/lib/tracking"
import type { TrackingItemInfo, TrackingUserInfo } from "@/lib/tracking"
import { headers } from "next/headers"

/**
 * Get basic user info from request headers for tracking.
 */
async function getUserInfoFromRequest(): Promise<TrackingUserInfo> {
    const headerStore = await headers()
    return {
        ip: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || undefined,
        userAgent: headerStore.get("user-agent") || undefined,
    }
}

/**
 * Server action: Track AddToCart event.
 * Called from client components (e.g., product-card).
 */
export async function serverTrackAddToCart(item: TrackingItemInfo, userEmail?: string) {
    const requestUser = await getUserInfoFromRequest()
    if (userEmail) requestUser.email = userEmail

    await trackAddToCart(item, requestUser)
}

/**
 * Server action: Track InitiateCheckout event.
 * Called from client components (e.g., checkout page).
 */
export async function serverTrackInitiateCheckout(
    totalValue: number,
    numItems: number,
    userEmail?: string,
    userPhone?: string
) {
    const requestUser = await getUserInfoFromRequest()
    if (userEmail) requestUser.email = userEmail
    if (userPhone) requestUser.phone = userPhone

    await trackInitiateCheckout(totalValue, numItems, requestUser)
}

/**
 * Server action: Track ViewContent event.
 * Called from client components (e.g., product pages).
 */
export async function serverTrackViewContent(item: TrackingItemInfo, userEmail?: string) {
    const requestUser = await getUserInfoFromRequest()
    if (userEmail) requestUser.email = userEmail

    await trackViewContent(item, requestUser)
}
