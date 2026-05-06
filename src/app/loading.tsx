import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/components/product-card-skeleton"

export default function HomeLoading() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Carousel Skeleton */}
            <section className="w-full">
                <Skeleton className="w-full aspect-[16/6] rounded-none" />
            </section>

            {/* New Arrivals Skeleton */}
            <section className="container py-12">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={i >= 5 ? "hidden lg:block h-full" : "h-full"}>
                            <ProductCardSkeleton />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-10">
                    <Skeleton className="h-11 w-40 rounded-md" />
                </div>
            </section>

            {/* Features Grid Skeleton */}
            <section className="container py-12 md:py-24 lg:py-32">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg bg-card">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories Skeleton */}
            <section className="bg-muted/40 py-12 md:py-24">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <Skeleton className="h-9 w-56" />
                        <Skeleton className="h-4 w-72" />
                    </div>
                    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 py-12 md:grid-cols-3 lg:gap-12">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Banner Skeleton */}
            <section className="w-full">
                <Skeleton className="w-full aspect-[1920/800] rounded-none" />
            </section>
        </div>
    )
}
