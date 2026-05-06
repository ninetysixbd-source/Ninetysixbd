"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function OrderSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [value, setValue] = useState(searchParams.get("search") || "")
    // Simple debounce implementation if hooks/use-debounce doesn't exist, 
    // but better to implement it inside useEffect here to be self-contained if we aren't sure.

    useEffect(() => {
        setValue(searchParams.get("search") || "")
    }, [searchParams])

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set("search", value)
            } else {
                params.delete("search")
            }
            params.set("page", "1") // Reset to page 1 on search

            // Only push if simple param change to avoid loop
            if (params.toString() !== searchParams.toString()) {
                router.push(`?${params.toString()}`)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [value, router, searchParams])

    return (
        <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search orders..."
                className="pl-9"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    )
}
