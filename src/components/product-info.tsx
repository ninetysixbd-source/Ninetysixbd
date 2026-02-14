"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { SerializableProduct } from "@/lib/types"

interface ProductInfoProps {
    product: SerializableProduct
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState<string>("")

    // Check if product has sizes
    const availableSizes = (product as any).sizes?.available || []
    const unavailableSizes = (product as any).sizes?.unavailable || []
    const hasSizes = availableSizes.length > 0 || unavailableSizes.length > 0

    // Check if product has colors
    const availableColors = (product as any).colors?.available || []
    const unavailableColors = (product as any).colors?.unavailable || []
    const hasColors = availableColors.length > 0 || unavailableColors.length > 0

    // Auto-select first available size if not selected
    if (hasSizes && !selectedSize && availableSizes.length > 0) {
        setSelectedSize(availableSizes[0])
    }

    // Auto-select first available color if not selected
    if (hasColors && !selectedColor && availableColors.length > 0) {
        setSelectedColor(availableColors[0])
    }

    return (
        <div className="mt-10 sm:px-0 lg:mt-0">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                    <p className="mt-2 text-muted-foreground">{product.category?.name || "Category"}</p>
                </div>
                {(!product.inStock || product.stock <= 0) && (
                    <Badge variant="destructive">Out of Stock</Badge>
                )}
            </div>

            <div className="mt-4 flex items-end gap-3">
                <h2 className="sr-only">Product Information</h2>
                <p className="text-3xl tracking-tight font-medium text-primary">
                    Tk. {product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                </p>
                {product.salePrice && (
                    <>
                        <p className="text-lg text-muted-foreground line-through mb-1">
                            Tk. {product.price.toFixed(2)}
                        </p>
                        {product.discountPercentage && (
                            <Badge variant="destructive" className="mb-1.5">
                                {product.discountPercentage}% OFF
                            </Badge>
                        )}
                    </>
                )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
                {/* Color Selector */}
                {hasColors && (
                    <div>
                        <h3 className="text-sm font-medium mb-2">Color: {selectedColor}</h3>
                        <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                            {availableColors.map((color: string) => (
                                <div key={color}>
                                    <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                                    <Label
                                        htmlFor={`color-${color}`}
                                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/20 cursor-pointer transition-all"
                                        title={color}
                                    >
                                        <span
                                            className="h-8 w-8 rounded-full border border-black/10"
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
                        <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                            {availableSizes.map((size: string) => (
                                <div key={size}>
                                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                                    <Label
                                        htmlFor={`size-${size}`}
                                        className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-popover hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all font-medium"
                                    >
                                        {size}
                                    </Label>
                                </div>
                            ))}
                            {unavailableSizes.map((size: string) => (
                                <div key={size} className="opacity-50 cursor-not-allowed" title="Out of stock">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-muted text-muted-foreground line-through">
                                        {size}
                                    </div>
                                </div>
                            ))}
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
                            className="h-9 w-9 rounded-none"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-none"
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={quantity >= product.stock}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                </div>

                <div
                    className="prose prose-sm max-w-none text-muted-foreground my-8 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                />

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    {product.inStock && product.stock > 0 ? (
                        <AddToCartButton
                            product={product}
                            size={selectedSize}
                            color={selectedColor}
                            quantity={quantity}
                            buttonSize="lg"
                            className="w-full md:w-auto flex-1 bg-black hover:bg-black/90 text-white"
                        />
                    ) : (
                        <Button disabled size="lg" className="w-full md:w-auto flex-1">
                            Out of Stock
                        </Button>
                    )}
                    <Button variant="outline" size="lg" className="flex-1">Add to Wishlist</Button>
                </div>
            </div>
        </div>
    )
}
