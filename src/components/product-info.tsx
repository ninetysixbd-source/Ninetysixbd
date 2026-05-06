"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag, MessageCircle, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { SerializableProduct } from "@/lib/types"
import { useCartStore } from "@/lib/store/cart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fbTrackAddToCart } from "@/lib/fb-pixel"

interface ProductInfoProps {
    product: SerializableProduct
}

// Maps common color names (including custom ones) to their CSS color values
const COLOR_MAP: Record<string, string> = {
    // Greys & neutrals
    ash: "#B2BEB5",
    charcoal: "#36454F",
    slate: "#708090",
    smoke: "#D3D3D3",
    silver: "#C0C0C0",
    platinum: "#E5E4E2",
    pearl: "#F0EAD6",
    ivory: "#FFFFF0",
    cream: "#FFFDD0",
    beige: "#F5F5DC",
    khaki: "#C3B091",
    sand: "#C2B280",
    // Earth tones
    brown: "#8B4513",
    chocolate: "#7B3F00",
    caramel: "#C68642",
    tan: "#D2B48C",
    // Blues
    navy: "#001F5B",
    "navy blue": "#001F5B",
    denim: "#1560BD",
    cobalt: "#0047AB",
    royal: "#4169E1",
    "royal blue": "#4169E1",
    sky: "#87CEEB",
    "sky blue": "#87CEEB",
    teal: "#008080",
    turquoise: "#40E0D0",
    // Greens
    olive: "#808000",
    mint: "#98FF98",
    sage: "#B2AC88",
    forest: "#228B22",
    "forest green": "#228B22",
    emerald: "#50C878",
    lime: "#32CD32",
    // Reds & pinks
    maroon: "#800000",
    burgundy: "#800020",
    wine: "#722F37",
    crimson: "#DC143C",
    coral: "#FF7F50",
    salmon: "#FA8072",
    rose: "#FF007F",
    blush: "#DE5D83",
    // Yellows & oranges
    mustard: "#FFDB58",
    gold: "#FFD700",
    amber: "#FFBF00",
    copper: "#B87333",
    rust: "#B7410E",
    // Purples
    lavender: "#E6E6FA",
    lilac: "#C8A2C8",
    violet: "#EE82EE",
    indigo: "#4B0082",
    plum: "#DDA0DD",
    // Whites & blacks
    off_white: "#FAF9F6",
    "off white": "#FAF9F6",
    offwhite: "#FAF9F6",
    "off-white": "#FAF9F6",
}

/** Resolves a color name/value to a valid CSS background style */
function getColorStyle(color: string): React.CSSProperties {
    const lower = color.toLowerCase().trim()
    // Check our custom map first
    if (COLOR_MAP[lower]) {
        return { backgroundColor: COLOR_MAP[lower] }
    }
    // Try it directly as a CSS value (e.g. hex "#fff", "red", "blue")
    return { backgroundColor: lower }
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState<string>("")
    const [selectedColor, setSelectedColor] = useState<string>("")
    const addItem = useCartStore((state) => state.addItem)
    const router = useRouter()

    const handleBuyNow = () => {
        // Validate selections
        const availableSizes = (product as any).sizes?.available || []
        const availableColors = (product as any).colors?.available || []

        if (availableSizes.length > 0 && !selectedSize) {
            toast.error("Please select a size")
            return
        }

        if (availableColors.length > 0 && !selectedColor) {
            toast.error("Please select a color")
            return
        }

        addItem({
            id: `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`,
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: quantity,
            image: product.images[0] || "",
            size: selectedSize,
            color: selectedColor
        })

        fbTrackAddToCart({ id: product.id, name: product.name, price: product.salePrice || product.price, quantity })
        router.push("/checkout")
    }

    const handleWhatsApp = () => {
        const message = `Hi, I want to order this product:
${product.name}
Price: Tk. ${product.salePrice || product.price}
${selectedSize ? `Size: ${selectedSize}` : ''}
${selectedColor ? `Color: ${selectedColor}` : ''}
Quantity: ${quantity}

Product Link: ${window.location.href}`

        const url = `https://wa.me/8801990916880?text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
    }

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
                                            style={getColorStyle(color)}
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

                <div className="flex flex-col gap-3 pt-6">
                    <div className="flex flex-row gap-3">
                        {product.inStock && product.stock > 0 ? (
                            <>
                                <AddToCartButton
                                    product={product}
                                    size={selectedSize}
                                    color={selectedColor}
                                    quantity={quantity}
                                    buttonSize="lg"
                                    className="flex-1 bg-white text-black border border-black hover:bg-gray-100 px-2 sm:px-8 text-sm sm:text-base h-10 sm:h-11"
                                />
                                <Button
                                    size="lg"
                                    className="flex-1 bg-black text-white hover:bg-neutral-800 px-2 sm:px-8 text-sm sm:text-base h-10 sm:h-11"
                                    onClick={handleBuyNow}
                                >
                                    <Zap className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" /> Buy Now
                                </Button>
                            </>
                        ) : (
                            <Button disabled size="lg" className="w-full flex-1">
                                Out of Stock
                            </Button>
                        )}
                    </div>

                    {product.inStock && product.stock > 0 && (
                        <Button
                            size="lg"
                            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                            onClick={handleWhatsApp}
                        >
                            <MessageCircle className="mr-2 h-5 w-5" /> Order via WhatsApp
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
