import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"

export default function ProductsLoading() {
    return (
        <div className="container py-8 md:py-12 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-2">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-md" />
                ))}
            </div>
        </div>
    )
}
