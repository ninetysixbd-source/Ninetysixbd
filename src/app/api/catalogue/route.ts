import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

const BASE_URL = "https://www.ninetysixbd.com"
const BRAND = "NinetysixBD"
const CURRENCY = "BDT"

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}

export async function GET() {
    const products = await prisma.product.findMany({
        where: { status: "PUBLISHED", inStock: true },
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })

    const items = products.map((product) => {
        const price = Number(product.salePrice ?? product.price).toFixed(2)
        const originalPrice = Number(product.price).toFixed(2)
        const imageUrl = product.images?.[0] ?? ""
        const productUrl = `${BASE_URL}/product/${product.slug}`
        const availability = product.stock > 0 ? "in stock" : "out of stock"

        // Parse sizes and colors from JSON
        const sizesData = product.sizes as { available?: string[] } | null
        const colorsData = product.colors as { available?: string[] } | null
        const sizes = sizesData?.available ?? []
        const colors = colorsData?.available ?? []

        const sizeStr = sizes.length > 0 ? escapeXml(sizes.join(", ")) : ""
        const colorStr = colors.length > 0 ? escapeXml(colors[0]) : ""

        return `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      ${product.images?.[1] ? `<g:additional_image_link>${escapeXml(product.images[1])}</g:additional_image_link>` : ""}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${originalPrice} ${CURRENCY}</g:price>
      ${product.salePrice ? `<g:sale_price>${price} ${CURRENCY}</g:sale_price>` : ""}
      <g:brand>${BRAND}</g:brand>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing</g:google_product_category>
      <g:product_type>${escapeXml(product.category.name)}</g:product_type>
      ${colorStr ? `<g:color>${colorStr}</g:color>` : ""}
      ${sizeStr ? `<g:size>${sizeStr}</g:size>` : ""}
      <g:item_group_id>${escapeXml(product.id)}</g:item_group_id>
    </item>`
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${BRAND} Product Catalogue</title>
    <link>${BASE_URL}</link>
    <description>All products from NinetysixBD</description>
    ${items.join("\n")}
  </channel>
</rss>`

    return new NextResponse(xml, {
        status: 200,
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            // Cache for 1 hour on CDN, allow stale for 6 hours
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600",
        },
    })
}
