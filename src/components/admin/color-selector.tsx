"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ColorSelectorProps {
    value?: { available: string[]; unavailable: string[] }
    onChange: (value: { available: string[]; unavailable: string[] }) => void
}

const COMMON_COLORS = ["Red", "Blue", "Green", "Black", "White", "Navy", "Yellow", "Pink", "Purple", "Orange", "Grey"]

export function ColorSelector({ value, onChange }: ColorSelectorProps) {
    const [customColor, setCustomColor] = useState("")

    const available = value?.available || []
    const unavailable = value?.unavailable || []

    const toggleColor = (color: string, type: "available" | "unavailable") => {
        const current = type === "available" ? available : unavailable
        const other = type === "available" ? unavailable : available
        const otherType = type === "available" ? "unavailable" : "available"

        if (current.includes(color)) {
            // Remove from current list
            onChange({
                available: type === "available" ? current.filter(s => s !== color) : available,
                unavailable: type === "unavailable" ? current.filter(s => s !== color) : unavailable,
            })
        } else {
            // Add to current list, remove from other if exists
            onChange({
                [type]: [...current, color],
                [otherType]: other.filter(s => s !== color),
            } as any)
        }
    }

    const addCustomColor = () => {
        // Capitalize first letter
        const formattedColor = customColor.charAt(0).toUpperCase() + customColor.slice(1)

        if (formattedColor && !available.includes(formattedColor) && !unavailable.includes(formattedColor)) {
            onChange({
                available: [...available, formattedColor],
                unavailable,
            })
            setCustomColor("")
        }
    }

    const allColors = Array.from(new Set([...COMMON_COLORS, ...available, ...unavailable]))

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-medium mb-2">Available Colors</h4>
                <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => (
                        <Badge
                            key={color}
                            variant={available.includes(color) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleColor(color, "available")}
                        >
                            <span
                                className="mr-2 inline-block h-3 w-3 rounded-full border border-white/20"
                                style={{ backgroundColor: color.toLowerCase() }}
                            />
                            {color}
                            {available.includes(color) && (
                                <X className="ml-1 h-3 w-3" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium mb-2">Unavailable Colors</h4>
                <div className="flex flex-wrap gap-2">
                    {allColors.map((color) => (
                        <Badge
                            key={color}
                            variant={unavailable.includes(color) ? "destructive" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleColor(color, "unavailable")}
                        >
                            <span
                                className="mr-2 inline-block h-3 w-3 rounded-full border border-white/20"
                                style={{ backgroundColor: color.toLowerCase() }}
                            />
                            {color}
                            {unavailable.includes(color) && (
                                <X className="ml-1 h-3 w-3" />
                            )}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add custom color (e.g., Teal)"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomColor())}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="button" onClick={addCustomColor} variant="outline">
                    Add
                </Button>
            </div>
        </div>
    )
}
