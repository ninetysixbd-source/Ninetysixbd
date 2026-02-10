import { prisma } from "@/lib/prisma"
import { ProductCard } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { ProductFilters } from "@/components/product-filters"

const ITEMS_PER_PAGE = 12

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string
        page?: string
        min?: string
        max?: string
        sort?: string
    }>
}

export default async function ProductsPage(props: ProductsPageProps) {
    const searchParams = await props.searchParams
    const categorySlug = searchParams?.category
    const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10))
    const minPrice = searchParams?.min ? parseFloat(searchParams.min) : undefined
    const maxPrice = searchParams?.max ? parseFloat(searchParams.max) : undefined
    const sort = searchParams?.sort || "newest"

    // Build Where Clause
    const whereClause: any = {
        status: "PUBLISHED",
        category: categorySlug ? { slug: categorySlug } : undefined,
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        whereClause.price = {}
        if (minPrice !== undefined) whereClause.price.gte = minPrice
        if (maxPrice !== undefined) whereClause.price.lte = maxPrice
    }

    // Build OrderBy Clause
    let orderBy: any = { createdAt: "desc" }
    if (sort === "price-asc") orderBy = { price: "asc" }
    if (sort === "price-desc") orderBy = { price: "desc" }
    if (sort === "newest") orderBy = { createdAt: "desc" }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where: whereClause })
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    const productsData = await prisma.product.findMany({
        where: whereClause,
        orderBy: orderBy,
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    })

    const products = productsData.map((p: any) => ({
        ...p,
        images: p.images || [],
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
    }))

    return (
        <div className="container py-8 md:py-12 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between sticky top-0 z-10 bg-background/95 backdrop-blur py-2">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {categorySlug
                            ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Products`
                            : "All Products"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Showing {products.length} of {totalCount} results
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <ProductFilters />
                </div>
            </div>

            {products.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                    <p>No products found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        baseUrl="/products"
                    />
                </>
            )}
        </div>
    )
}
