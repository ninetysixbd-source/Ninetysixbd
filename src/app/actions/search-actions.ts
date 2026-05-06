"use server"

import { prisma } from "@/lib/prisma"

export async function searchProducts(query: string) {
    if (!query || query.trim().length === 0) {
        return { products: [], categories: [] }
    }

    const searchTerm = query.trim()

    // Search Categories
    const categories = await prisma.category.findMany({
        where: {
            name: {
                contains: searchTerm,
                mode: "insensitive",
            },
        },
        take: 5,
    })

    // Search Products
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        }
                    }
                }
            ],
            status: "PUBLISHED",
        },
        include: {
            category: true,
        },
        take: 10,
    })

    // Convert Decimals to numbers for client component
    const sanitizedProducts = products.map(p => ({
        ...p,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
    }))

    return {
        categories,
        products: sanitizedProducts
    }
}
