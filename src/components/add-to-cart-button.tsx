"use client"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store/cart"
// import { Product } from "@prisma/client" // Removed
import { SerializableProduct } from "@/lib/types"
import { toast } from "sonner"
import { ComponentProps } from "react"

// Omit 'size' from Button props to avoid conflict with our product size prop
interface AddToCartButtonProps extends Omit<ComponentProps<typeof Button>, 'size' | 'color'> {
    product: SerializableProduct
    size?: string // Product size (S, M, L)
    color?: string // Product color
    buttonSize?: ComponentProps<typeof Button>['size'] // Button visual size
    quantity?: number
}

export function AddToCartButton({ product, size, color, buttonSize, quantity = 1, className, ...props }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        // If product has sizes available, ensure size is selected
        const hasSizes = (product as any).sizes?.available?.length > 0
        if (hasSizes && !size) {
            toast.error("Please select a size first")
            return
        }

        // If product has colors available, ensure color is selected
        const hasColors = (product as any).colors?.available?.length > 0
        if (hasColors && !color) {
            toast.error("Please select a color first")
            return
        }

        addItem({
            id: `${product.id}-${size || 'default'}-${color || 'default'}`, // Unique ID for cart item
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: quantity,
            image: product.images[0] || "",
            size: size,
            color: color
        })
        toast.success("Added to cart")
    }

    return (
        <Button onClick={handleAddToCart} size={buttonSize} className={className} disabled={product.stock <= 0} {...props}>
            {product.stock > 0 ? "Add to Cart" : "Unavailable"}
        </Button>
    )
}
