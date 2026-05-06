"use client"

import Link from "next/link"
import { SerializableProduct } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react"
import { useCartStore } from "@/lib/store/cart"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { ShoppingCart, Zap, Loader2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { serverTrackAddToCart } from "@/app/actions/track-event"
import { fbTrackAddToCart } from "@/lib/fb-pixel"
import { getProductCardUrl } from "@/lib/imagekit"

// Lazy-load the heavy QuickView dialog — only downloaded when a user actually opens it
const ProductQuickView = lazy(() =>
    import("@/components/product-quick-view").then(mod => ({ default: mod.ProductQuickView }))
)


interface ProductCardProps {
    product: SerializableProduct
    priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
    const [showQuickView, setShowQuickView] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [action, setAction] = useState<'cart' | 'buy' | null>(null)
    const addItem = useCartStore((state) => state.addItem)
    const router = useRouter()
    const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const images = product.images || []
    const hasMultipleImages = images.length > 1

    const hasVariants = (product as any).sizes?.available?.length > 0 || (product as any).colors?.available?.length > 0

    // Cleanup touch timer on unmount
    useEffect(() => {
        return () => {
            if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
        }
    }, [])

    // Smooth touch release — let CSS transition animate the revert
    const handleTouchRelease = useCallback(() => {
        // Small delay so the browser can start the CSS transition before state flips
        touchTimerRef.current = setTimeout(() => {
            setIsHovered(false)
        }, 50)
    }, [])

    // Desktop click → navigate to product
    const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/product/${product.slug}`)
    }, [router, product.slug])

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (hasVariants) {
            setShowQuickView(true)
            return
        }

        setLoading(true)
        setAction('cart')

        await new Promise(resolve => setTimeout(resolve, 500))

        addItem({
            id: `${product.id}-default-default`,
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
            image: images[0] || "",
        })
        toast.success("Added to cart")

        // Client-side pixel tracking (visible in Pixel Helper)
        fbTrackAddToCart({ id: product.id, name: product.name, price: product.salePrice || product.price, quantity: 1 })

        // Server-side tracking: AddToCart
        serverTrackAddToCart({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
        }).catch(() => { })

        setLoading(false)
        setAction(null)
    }

    const handleBuyNow = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (hasVariants) {
            setShowQuickView(true)
            return
        }

        setLoading(true)
        setAction('buy')

        addItem({
            id: `${product.id}-default-default`,
            productId: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
            image: images[0] || "",
        })

        // Client-side pixel tracking (visible in Pixel Helper)
        fbTrackAddToCart({ id: product.id, name: product.name, price: product.salePrice || product.price, quantity: 1 })

        // Server-side tracking: AddToCart (Buy Now also counts)
        serverTrackAddToCart({
            id: product.id,
            name: product.name,
            price: product.salePrice || product.price,
            quantity: 1,
        }).catch(() => { })

        router.push("/checkout")
        setLoading(false)
    }


    return (
        <>
            <Card className="flex flex-col h-full overflow-hidden transition-all hover:border-black/50 group !p-0 !gap-0">
                <CardHeader
                    className="!p-0 !gap-0 aspect-[3/4] relative bg-muted overflow-hidden block"
                >
                    {/* Image */}
                    <div
                        className="absolute inset-0 z-[1] cursor-pointer"
                        onClick={handleImageClick}
                        onMouseEnter={() => hasMultipleImages && setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => {
                            if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
                            hasMultipleImages && setIsHovered(true)
                        }}
                        onTouchEnd={handleTouchRelease}
                        onTouchCancel={handleTouchRelease}
                    >
                        {images.length > 0 ? (
                            <div className="relative w-full h-full overflow-hidden">
                                {/* First image — fades out on hover */}
                                <Image
                                    src={getProductCardUrl(images[0])}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                                    className="object-cover transition-opacity duration-[900ms]"
                                    style={{ opacity: isHovered ? 0 : 1 }}
                                    priority={priority}
                                    loading={priority ? undefined : "lazy"}
                                />
                                {/* Second image — fades in and slowly zooms in on hover */}
                                {hasMultipleImages && (
                                    <Image
                                        src={getProductCardUrl(images[1])}
                                        alt={`${product.name} - 2`}
                                        fill
                                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
                                        className="object-cover transition-all duration-[900ms] ease-out"
                                        style={{
                                            opacity: isHovered ? 1 : 0,
                                            transform: isHovered ? 'scale(1.07)' : 'scale(1.0)'
                                        }}
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <span className="text-4xl text-gray-300">Image</span>
                            </div>
                        )}
                    </div>


                    {product.status === 'PUBLISHED' && (product.stock <= 0 || !product.inStock) && (
                        <div className="absolute top-4 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider z-10">Out of Stock</div>
                    )}

                    {/* Hover Overlay Button - Hidden on mobile, shown on desktop hover */}
                    <div
                        className={`hidden md:flex absolute inset-x-0 bottom-0 p-4 transition-all duration-300 bg-gradient-to-t from-black/50 to-transparent gap-2 pointer-events-none z-20 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="pointer-events-auto w-full flex gap-2">
                            <Button
                                className="flex-1 bg-white text-black hover:bg-gray-100"
                                size="sm"
                                onClick={handleAddToCart}
                                disabled={loading || product.stock <= 0}
                            >
                                {loading && action === 'cart' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                )}
                                Add
                            </Button>
                            <Button
                                className="flex-1 bg-black text-white hover:bg-black/90"
                                size="sm"
                                onClick={handleBuyNow}
                                disabled={loading || product.stock <= 0}
                            >
                                {loading && action === 'buy' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Zap className="h-4 w-4 mr-2" />
                                )}
                                Buy
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">Tk. {Number(product.salePrice ?? product.price).toFixed(2)}</span>
                            {product.salePrice && (
                                <span className="text-xs text-muted-foreground line-through">Tk. {Number(product.price).toFixed(2)}</span>
                            )}
                        </div>
                        {/* Mobile Quick View Button - Visible only on mobile */}
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-md bg-red-600 text-white hover:bg-red-700 md:hidden shrink-0"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                router.push(`/product/${product.slug}`)
                            }}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span className="sr-only">View Product</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Lazy-loaded QuickView — only mounts when showQuickView is true */}
            {showQuickView && (
                <Suspense fallback={null}>
                    <ProductQuickView
                        open={showQuickView}
                        onOpenChange={setShowQuickView}
                        product={{
                            ...product,
                            status: product.status || 'PUBLISHED',
                            images: images
                        }}
                    />
                </Suspense>
            )}
        </>
    )
}
