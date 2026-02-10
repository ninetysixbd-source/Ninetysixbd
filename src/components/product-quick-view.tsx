"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useCartStore } from "@/lib/store/cart"
import { toast } from "sonner"
import Image from "next/image"

export interface Product {
    id: string
    name: string
    price: number
    salePrice: number | null
    stock: number
    status: string
    images: string[]
    description?: string
    slug: string
}

interface ProductQuickViewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product
}

export function ProductQuickView({ open, onOpenChange, product }: ProductQuickViewProps) {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState("")
    const [selectedColor, setSelectedColor] = useState("")
    const { addItem } = useCartStore()
    const router = useRouter()

    // Handle sizes safely
    const availableSizes = (product as any).sizes?.available || []
    const unavailableSizes = (product as any).sizes?.unavailable || []
    const hasSizes = availableSizes.length > 0 || unavailableSizes.length > 0
    const allSizes = ["S", "M", "L", "XL", "XXL"]

    // Handle colors safely
    const availableColors = (product as any).colors?.available || []
    const unavailableColors = (product as any).colors?.unavailable || []
    const hasColors = availableColors.length > 0 || unavailableColors.length > 0

    // Initialize size/color if needed
    if (open) {
        if (hasSizes && !selectedSize && availableSizes.length > 0) {
            setSelectedSize(availableSizes[0])
        }
        if (hasColors && !selectedColor && availableColors.length > 0) {
            setSelectedColor(availableColors[0])
        }
    }

    const addToCart = () => {
        if (hasSizes && !selectedSize) {
            toast.error("Please select a size first")
            return
        }

        if (hasColors && !selectedColor) {
            toast.error("Please select a color first")
            return
        }

        addItem({
            id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.images[0] || "",
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        })
    }

    const handleAddToCart = () => {
        addToCart()
        toast.success("Added to cart")
        onOpenChange(false)
    }

    const handleBuyNow = () => {
        addToCart()
        onOpenChange(false)
        router.push("/checkout")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl overflow-hidden p-0">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Column */}
                    <div className="bg-gray-100 aspect-square md:aspect-auto flex items-center justify-center p-6 relative">
                        {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
                        ) : (
                            <span className="text-muted-foreground">No Image</span>
                        )}
                        {product.salePrice && (
                            <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">Sale</Badge>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="p-6 md:p-8 flex flex-col h-full bg-white">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-2xl font-bold">{product.name}</h2>
                            {product.stock <= 0 && <Badge variant="destructive">Out of Stock</Badge>}
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-xl font-bold text-red-600">
                                Tk. {Number(product.salePrice ?? product.price).toFixed(2)}
                            </span>
                            {product.salePrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                    Tk. {Number(product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                            {product.description || "No description available."}
                        </p>

                        <div className="space-y-4 mb-6">
                            {/* Color Selector */}
                            {hasColors && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Color: {selectedColor}</h3>
                                    <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                                        {availableColors.map((color: string) => (
                                            <div key={color}>
                                                <RadioGroupItem value={color} id={`qv-color-${color}`} className="peer sr-only" />
                                                <Label
                                                    htmlFor={`qv-color-${color}`}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20 cursor-pointer transition-all"
                                                    title={color}
                                                >
                                                    <span
                                                        className="h-7 w-7 rounded-full border border-black/10"
                                                        style={{ backgroundColor: color.toLowerCase() }}
                                                    />
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            )}

                            {/* Size Selector */}
                            {hasSizes && (
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-semibold text-sm">Size: {selectedSize}</span>
                                        <button className="text-xs underline text-muted-foreground">Size Guide</button>
                                    </div>
                                    <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex gap-2">
                                        {allSizes.map((size) => {
                                            const isAvailable = availableSizes.includes(size)
                                            // Only show sizes that are either available or explicitly marked unavailable (if we want to show out of stock options)
                                            // Or we can just show the standard list and disable what's not there if we assume all products follow S-XXL.
                                            // Better: Show S-XXL but disable if not in available sizes.

                                            return (
                                                <div key={size}>
                                                    <RadioGroupItem
                                                        value={size}
                                                        id={`size-${size}`}
                                                        className="peer sr-only"
                                                        disabled={!isAvailable}
                                                    />
                                                    <Label
                                                        htmlFor={`size-${size}`}
                                                        className={`flex h-9 w-9 items-center justify-center rounded-md border border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer ${!isAvailable ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground decoration-slate-500 line-through' : ''}`}
                                                    >
                                                        {size}
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </RadioGroup>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="flex items-center gap-4">
                                <span className="font-semibold text-sm">Quantity:</span>
                                <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-none"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-10 text-center text-sm">{quantity}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-none"
                                        onClick={() => setQuantity(quantity + 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t grid grid-cols-2 gap-3">
                            <Button className="w-full h-10 bg-black text-white hover:bg-black/90 px-2" onClick={handleAddToCart} disabled={product.stock <= 0}>
                                Add to Cart
                            </Button>
                            <Button className="w-full h-10 px-2" variant="outline" onClick={handleBuyNow} disabled={product.stock <= 0}>Buy Now</Button>
                        </div>

                        <div className="text-xs text-muted-foreground mt-4 text-center">
                            Product Code: {product.slug.toUpperCase().slice(0, 6)}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
