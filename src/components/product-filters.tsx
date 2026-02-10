"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Filter, X } from "lucide-react"

// Since we checked and didn't find specific slider, we'll stick to Inputs for now or implement a basic one if needed.
// But mostly users prefer Inputs for precise price. 

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [minPrice, setMinPrice] = useState(searchParams.get("min") || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "")
    const [sort, setSort] = useState(searchParams.get("sort") || "newest")
    const [isOpen, setIsOpen] = useState(false)

    // Update state when URL changes
    useEffect(() => {
        setMinPrice(searchParams.get("min") || "")
        setMaxPrice(searchParams.get("max") || "")
        setSort(searchParams.get("sort") || "newest")
    }, [searchParams])

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (minPrice) params.set("min", minPrice)
        else params.delete("min")

        if (maxPrice) params.set("max", maxPrice)
        else params.delete("max")

        if (sort) params.set("sort", sort)
        else params.delete("sort")

        // Reset page on filter change
        params.set("page", "1")

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("min")
        params.delete("max")
        params.delete("sort")
        params.set("page", "1")

        setMinPrice("")
        setMaxPrice("")
        setSort("newest")

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    return (
        <>
            {/* Mobile/Desktop Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                        <Filter className="h-4 w-4" />
                        Filters & Sort
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                            Refine your product search
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid gap-6 py-6 px-4">
                        {/* Sort */}
                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort order" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Separator />

                        {/* Price Range */}
                        <div className="space-y-4">
                            <Label>Price Range</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="min-price" className="text-xs text-muted-foreground">Min Price</Label>
                                    <Input
                                        id="min-price"
                                        type="number"
                                        placeholder="0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-price" className="text-xs text-muted-foreground">Max Price</Label>
                                    <Input
                                        id="max-price"
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={applyFilters}>Apply Filters</Button>
                            <Button variant="outline" onClick={clearFilters}>Reset</Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
