"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    totalPages: number
    currentPage: number
    baseUrl: string
}

export function Pagination({ totalPages, currentPage, baseUrl }: PaginationProps) {
    const searchParams = useSearchParams()

    function getPageUrl(page: number) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        return `${baseUrl}?${params.toString()}`
    }

    if (totalPages <= 1) return null

    const pages: (number | string)[] = []

    // Always show first page
    pages.push(1)

    if (currentPage > 3) {
        pages.push("...")
    }

    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
            pages.push(i)
        }
    }

    if (currentPage < totalPages - 2) {
        pages.push("...")
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages)
    }

    return (
        <div className="flex items-center justify-center gap-2 py-4">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link href={getPageUrl(currentPage - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span><ChevronLeft className="h-4 w-4" /></span>
                )}
            </Button>

            {pages.map((page, i) =>
                typeof page === "string" ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">...</span>
                ) : (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        asChild={page !== currentPage}
                    >
                        {page === currentPage ? (
                            <span>{page}</span>
                        ) : (
                            <Link href={getPageUrl(page)}>{page}</Link>
                        )}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link href={getPageUrl(currentPage + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span><ChevronRight className="h-4 w-4" /></span>
                )}
            </Button>
        </div>
    )
}
