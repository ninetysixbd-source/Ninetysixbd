import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
    return (
        <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="p-0 border-b aspect-[3/4] relative">
                <Skeleton className="h-full w-full rounded-none" />
            </CardHeader>
            <CardContent className="grid gap-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-10 rounded-md md:hidden" />
                </div>
            </CardContent>
        </Card>
    )
}
