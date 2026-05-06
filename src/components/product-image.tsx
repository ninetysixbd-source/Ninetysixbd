"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import {
    getProductCardUrl,
    getProductDetailUrl,
    getProductThumbnailUrl,
    getImageKitUrl,
    type IKTransformOptions,
} from "@/lib/imagekit"

interface ProductImageProps {
    src: string
    alt: string
    fill?: boolean
    width?: number
    height?: number
    className?: string
    containerClassName?: string
    sizes?: string
    priority?: boolean
    objectFit?: "cover" | "contain"
    onLoad?: () => void
    /**
     * Image quality preset:
     * - "card"      → product grid thumbnail (400px, q75)
     * - "detail"    → product page main image (900px, q80)
     * - "thumbnail" → gallery thumbnail strip (150px, q70)
     * - "raw"       → no ImageKit transform (fallback)
     * Defaults to "detail".
     */
    preset?: "card" | "detail" | "thumbnail" | "raw"
    /** Override individual transform params (used when preset is insufficient) */
    transformOptions?: IKTransformOptions
}

export function ProductImage({
    src,
    alt,
    fill,
    width,
    height,
    className,
    containerClassName,
    sizes,
    priority = false,
    objectFit = "cover",
    onLoad,
    preset = "detail",
    transformOptions,
}: ProductImageProps) {
    // Resolve the optimized URL via ImageKit
    let optimizedSrc = src
    if (transformOptions) {
        optimizedSrc = getImageKitUrl(src, transformOptions)
    } else {
        switch (preset) {
            case "card":
                optimizedSrc = getProductCardUrl(src)
                break
            case "thumbnail":
                optimizedSrc = getProductThumbnailUrl(src)
                break
            case "raw":
                optimizedSrc = src
                break
            case "detail":
            default:
                optimizedSrc = getProductDetailUrl(src)
                break
        }
    }

    return (
        <Image
            src={optimizedSrc}
            alt={alt}
            fill={fill}
            width={!fill ? width : undefined}
            height={!fill ? height : undefined}
            sizes={sizes}
            priority={priority}
            className={cn(
                objectFit === "cover" ? "object-cover" : "object-contain",
                className
            )}
            onLoad={onLoad}
        />
    )
}

// Backward compatibility alias
export { ProductImage as BlurImage }

