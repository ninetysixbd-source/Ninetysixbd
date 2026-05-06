"use server"

import crypto from "crypto"

// ─── Configuration ───────────────────────────────────────────────────────────
const META_PIXEL_ID = process.env.META_PIXEL_ID || ""
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || ""
const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID || ""
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || ""

const META_API_VERSION = "v19.0"
const META_API_URL = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`
const TIKTOK_API_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sha256(value: string): string {
    return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex")
}

function generateEventId(): string {
    return crypto.randomUUID()
}

// ─── Meta Conversions API ────────────────────────────────────────────────────

interface MetaUserData {
    em?: string   // email (will be hashed)
    ph?: string   // phone (will be hashed)
    fn?: string   // first name (will be hashed)
    client_ip_address?: string
    client_user_agent?: string
    fbc?: string  // click ID cookie
    fbp?: string  // browser ID cookie
}

interface MetaCustomData {
    currency?: string
    value?: number
    content_name?: string
    content_ids?: string[]
    content_type?: string
    contents?: Array<{ id: string; quantity: number; item_price?: number }>
    num_items?: number
}

async function trackMetaEvent(
    eventName: string,
    userData: MetaUserData = {},
    customData: MetaCustomData = {},
    eventId?: string
) {
    if (!META_PIXEL_ID || !META_ACCESS_TOKEN) return

    const hashedUserData: Record<string, string | undefined> = {}
    if (userData.em) hashedUserData.em = sha256(userData.em)
    if (userData.ph) hashedUserData.ph = sha256(userData.ph.replace(/\D/g, ""))
    if (userData.fn) hashedUserData.fn = sha256(userData.fn)
    if (userData.client_ip_address) hashedUserData.client_ip_address = userData.client_ip_address
    if (userData.client_user_agent) hashedUserData.client_user_agent = userData.client_user_agent
    if (userData.fbc) hashedUserData.fbc = userData.fbc
    if (userData.fbp) hashedUserData.fbp = userData.fbp

    const payload = {
        data: [
            {
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_id: eventId || generateEventId(),
                action_source: "website",
                user_data: hashedUserData,
                custom_data: customData,
            },
        ],
        access_token: META_ACCESS_TOKEN,
    }

    try {
        const res = await fetch(META_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const errorBody = await res.text()
            console.error(`[Meta Tracking] ${eventName} failed:`, res.status, errorBody)
        }
    } catch (error) {
        console.error(`[Meta Tracking] ${eventName} error:`, error)
    }
}

// ─── TikTok Events API ──────────────────────────────────────────────────────

interface TikTokUserData {
    email?: string   // will be hashed
    phone?: string   // will be hashed
    ip?: string
    user_agent?: string
}

interface TikTokProperties {
    currency?: string
    value?: number
    contents?: Array<{
        content_id: string
        content_name?: string
        quantity: number
        price?: number
    }>
    content_type?: string
}

async function trackTikTokEvent(
    eventName: string,
    userData: TikTokUserData = {},
    properties: TikTokProperties = {},
    eventId?: string
) {
    if (!TIKTOK_PIXEL_ID || !TIKTOK_ACCESS_TOKEN) return

    const hashedUser: Record<string, string | undefined> = {}
    if (userData.email) hashedUser.email = sha256(userData.email)
    if (userData.phone) hashedUser.phone_number = sha256(userData.phone.replace(/\D/g, ""))
    if (userData.ip) hashedUser.ip = userData.ip
    if (userData.user_agent) hashedUser.user_agent = userData.user_agent

    const payload = {
        pixel_code: TIKTOK_PIXEL_ID,
        event: eventName,
        event_id: eventId || generateEventId(),
        timestamp: new Date().toISOString(),
        context: {
            user: hashedUser,
            page: {
                url: process.env.NEXT_PUBLIC_SITE_URL || "https://ninetysixbd.com",
            },
        },
        properties,
    }

    try {
        const res = await fetch(TIKTOK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Token": TIKTOK_ACCESS_TOKEN,
            },
            body: JSON.stringify(payload),
        })
        if (!res.ok) {
            const errorBody = await res.text()
            console.error(`[TikTok Tracking] ${eventName} failed:`, res.status, errorBody)
        }
    } catch (error) {
        console.error(`[TikTok Tracking] ${eventName} error:`, error)
    }
}

// ─── Convenience Functions (fire on all platforms) ───────────────────────────

export interface TrackingUserInfo {
    email?: string
    phone?: string
    name?: string
    ip?: string
    userAgent?: string
}

export interface TrackingItemInfo {
    id: string
    name: string
    price: number
    quantity: number
}

/**
 * Track a Purchase event on all platforms.
 * Call this after a successful order creation.
 */
export async function trackPurchase(
    orderValue: number,
    items: TrackingItemInfo[],
    user: TrackingUserInfo = {},
    eventId?: string
) {
    const eid = eventId || generateEventId()

    await Promise.allSettled([
        trackMetaEvent(
            "Purchase",
            {
                em: user.email,
                ph: user.phone,
                fn: user.name,
                client_ip_address: user.ip,
                client_user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: orderValue,
                content_type: "product",
                content_ids: items.map((i) => i.id),
                contents: items.map((i) => ({
                    id: i.id,
                    quantity: i.quantity,
                    item_price: i.price,
                })),
                num_items: items.reduce((sum, i) => sum + i.quantity, 0),
            },
            eid
        ),
        trackTikTokEvent(
            "CompletePayment",
            {
                email: user.email,
                phone: user.phone,
                ip: user.ip,
                user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: orderValue,
                content_type: "product",
                contents: items.map((i) => ({
                    content_id: i.id,
                    content_name: i.name,
                    quantity: i.quantity,
                    price: i.price,
                })),
            },
            eid
        ),
    ])
}

/**
 * Track an AddToCart event on all platforms.
 */
export async function trackAddToCart(
    item: TrackingItemInfo,
    user: TrackingUserInfo = {},
    eventId?: string
) {
    const eid = eventId || generateEventId()

    await Promise.allSettled([
        trackMetaEvent(
            "AddToCart",
            {
                em: user.email,
                ph: user.phone,
                client_ip_address: user.ip,
                client_user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: item.price * item.quantity,
                content_name: item.name,
                content_ids: [item.id],
                content_type: "product",
                contents: [{ id: item.id, quantity: item.quantity, item_price: item.price }],
            },
            eid
        ),
        trackTikTokEvent(
            "AddToCart",
            {
                email: user.email,
                phone: user.phone,
                ip: user.ip,
                user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: item.price * item.quantity,
                content_type: "product",
                contents: [{ content_id: item.id, content_name: item.name, quantity: item.quantity, price: item.price }],
            },
            eid
        ),
    ])
}

/**
 * Track an InitiateCheckout event on all platforms.
 */
export async function trackInitiateCheckout(
    totalValue: number,
    numItems: number,
    user: TrackingUserInfo = {},
    eventId?: string
) {
    const eid = eventId || generateEventId()

    await Promise.allSettled([
        trackMetaEvent(
            "InitiateCheckout",
            {
                em: user.email,
                ph: user.phone,
                client_ip_address: user.ip,
                client_user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: totalValue,
                num_items: numItems,
            },
            eid
        ),
        trackTikTokEvent(
            "InitiateCheckout",
            {
                email: user.email,
                phone: user.phone,
                ip: user.ip,
                user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: totalValue,
            },
            eid
        ),
    ])
}

/**
 * Track a ViewContent event on all platforms.
 */
export async function trackViewContent(
    item: TrackingItemInfo,
    user: TrackingUserInfo = {},
    eventId?: string
) {
    const eid = eventId || generateEventId()

    await Promise.allSettled([
        trackMetaEvent(
            "ViewContent",
            {
                em: user.email,
                client_ip_address: user.ip,
                client_user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: item.price,
                content_name: item.name,
                content_ids: [item.id],
                content_type: "product",
            },
            eid
        ),
        trackTikTokEvent(
            "ViewContent",
            {
                email: user.email,
                ip: user.ip,
                user_agent: user.userAgent,
            },
            {
                currency: "BDT",
                value: item.price,
                content_type: "product",
                contents: [{ content_id: item.id, content_name: item.name, quantity: 1, price: item.price }],
            },
            eid
        ),
    ])
}
