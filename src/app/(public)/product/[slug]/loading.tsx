import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
    return (
        <div className="container py-8 md:py-12">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-md" />
                        ))}
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="mt-8 lg:mt-0 space-y-6">
                    {/* Category */}
                    <Skeleton className="h-5 w-20 rounded-full" />

                    {/* Title */}
                    <Skeleton className="h-8 w-3/4" />

                    {/* Price */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-5 w-20" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-12" />
                        <div className="flex gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-10 rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Color Selector */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-12" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-8 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-10 rounded-md" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Skeleton className="h-12 flex-1 rounded-md" />
                        <Skeleton className="h-12 flex-1 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
