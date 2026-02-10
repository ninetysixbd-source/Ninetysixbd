import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { SearchIcon } from "lucide-react"
import Link from "next/link"

interface SearchPageProps {
    searchParams: Promise<{
        q?: string
    }>
}

export default async function SearchPage(props: SearchPageProps) {
    const searchParams = await props.searchParams
    const query = searchParams?.q || ""

    let products: any[] = []

    if (query.trim()) {
        const productsData = await prisma.product.findMany({
            where: {
                status: "PUBLISHED",
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                ],
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        })

        products = productsData.map((p) => ({
            ...p,
            price: Number(p.price),
            salePrice: p.salePrice ? Number(p.salePrice) : null,
        }))
    }

    return (
        <div className="container py-8 md:py-12 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {query ? `Search results for "${query}"` : "Search Products"}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {query ? `Found ${products.length} product(s)` : "Enter a search term to find products"}
                    </p>
                </div>
            </div>

            {!query ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                    <SearchIcon className="h-12 w-12 mb-4" />
                    <p>Use the search bar to find products</p>
                </div>
            ) : products.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                    <p className="mb-4">No products found for "{query}"</p>
                    <Link href="/products" className="text-primary hover:underline">
                        Browse all products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    )
}
