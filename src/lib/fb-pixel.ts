"use client"

/**
 * Client-side Facebook Pixel tracking helpers.
 *
 * These fire browser-side fbq() calls so events show up
 * in the Facebook Pixel Helper extension.  They complement
 * the server-side Conversions API calls in lib/tracking.ts.
 */

// Safe wrapper — if fbq hasn't loaded yet, do nothing
function fbq(...args: any[]) {
    if (typeof window !== "undefined" && (window as any).fbq) {
        ; (window as any).fbq(...args)
    }
}

export function fbTrackAddToCart(item: {
    id: string
    name: string
    price: number
    quantity: number
}) {
    fbq("track", "AddToCart", {
        content_name: item.name,
        content_ids: [item.id],
        content_type: "product",
        value: item.price * item.quantity,
        currency: "BDT",
    })
}

export function fbTrackInitiateCheckout(
    totalValue: number,
    numItems: number
) {
    fbq("track", "InitiateCheckout", {
        value: totalValue,
        currency: "BDT",
        num_items: numItems,
    })
}

export function fbTrackPurchase(
    orderValue: number,
    items: Array<{ id: string; name: string; quantity: number; price: number }>
) {
    fbq("track", "Purchase", {
        value: orderValue,
        currency: "BDT",
        content_type: "product",
        content_ids: items.map((i) => i.id),
        num_items: items.reduce((sum, i) => sum + i.quantity, 0),
    })
}

export function fbTrackViewContent(item: {
    id: string
    name: string
    price: number
}) {
    fbq("track", "ViewContent", {
        content_name: item.name,
        content_ids: [item.id],
        content_type: "product",
        value: item.price,
        currency: "BDT",
    })
}
