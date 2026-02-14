"use client"

import Link from "next/link"
import { SerializableProduct } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ProductQuickView } from "@/components/product-quick-view"

interface ProductCardProps {
    product: SerializableProduct
}

export function ProductCard({ product }: ProductCardProps) {
    const [showQuickView, setShowQuickView] = useState(false)

    return (
        <>
            <Card className="flex flex-col h-full overflow-hidden transition-all hover:border-black/50 group">
                <CardHeader className="p-0 border-b aspect-[4/5] relative bg-muted overflow-hidden">
                    <Link href={`/product/${product.slug}`} className="block h-full w-full">
                        {/* Image Placeholder - Will be real image later */}
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground transition-transform duration-500 group-hover:scale-105 bg-gray-100">
                            {product.images && product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-4xl text-gray-300">Image</span>
                            )}
                        </div>
                    </Link>
                    {product.status === 'PUBLISHED' && (product.stock <= 0 || !product.inStock) && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10">Out of Stock</div>
                    )}

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/50 to-transparent flex gap-2 pointer-events-none">
                        <div className="pointer-events-auto w-full">
                            <Button className="w-full bg-white text-black hover:bg-gray-100" size="sm" onClick={() => setShowQuickView(true)}>
                                Quick Shop
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-1 p-4">
                    <h3 className="text-base font-medium truncate hover:text-black transition-colors">
                        <Link href={`/product/${product.slug}`}>
                            {product.name}
                        </Link>
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">Tk. {Number(product.salePrice ?? product.price).toFixed(2)}</span>
                        {product.salePrice && (
                            <span className="text-xs text-muted-foreground line-through">Tk. {Number(product.price).toFixed(2)}</span>
                        )}
                    </div>
                </CardContent>
            </Card>

            <ProductQuickView
                open={showQuickView}
                onOpenChange={setShowQuickView}
                product={{
                    ...product,
                    status: product.status || 'PUBLISHED', // Fallback
                    images: product.images || []
                }}
            />
        </>
    )
}
