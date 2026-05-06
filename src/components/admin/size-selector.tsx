"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface SizeSelectorProps {
    value?: { available: string[]; unavailable: string[] }
    onChange: (value: { available: string[]; unavailable: string[] }) => void
}

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
    const [customSize, setCustomSize] = useState("")

    const available = value?.available || []
    const unavailable = value?.unavailable || []

    const toggleSize = (size: string, type: "available" | "unavailable") => {
        const current = type === "available" ? available : unavailable
        const other = type === "available" ? unavailable : available
        const otherType = type === "available" ? "unavailable" : "available"

        if (current.includes(size)) {
            // Remove from current list
            onChange({
                available: type === "available" ? current.filter(s => s !== size) : available,
                unavailable: type === "unavailable" ? current.filter(s => s !== size) : unavailable,
            })
        } else {
            // Add to current list, remove from other if exists
            onChange({
                [type]: [...current, size],
                [otherType]: other.filter(s => s !== size),
            } as any)
        }
    }

    const addCustomSize = () => {
        if (customSize && !available.includes(customSize) && !unavailable.includes(customSize)) {
            onChange({
                available,
                unavailable: [...unavailable, customSize],
            })
            setCustomSize("")
        }
    }

    const allSizes = Array.from(new Set([...COMMON_SIZES, ...available, ...unavailable]))

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-medium mb-2">Available Sizes</h4>
                <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                        <Badge
                            key={size}
                            variant={available.includes(size) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleSize(size, "available")}
                        >
                            {size}
                            {available.includes(size) && (
                                <X className="ml-1 h-3 w-3" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium mb-2">Unavailable Sizes</h4>
                <div className="flex flex-wrap gap-2">
                    {allSizes.map((size) => (
                        <Badge
                            key={size}
                            variant={unavailable.includes(size) ? "destructive" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleSize(size, "unavailable")}
                        >
                            {size}
                            {unavailable.includes(size) && (
                                <X className="ml-1 h-3 w-3" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add custom size (e.g., 32W)"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSize())}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="button" onClick={addCustomSize} variant="outline">
                    Add
                </Button>
            </div>
        </div>
    )
}
