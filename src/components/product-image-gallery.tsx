"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProductImageGalleryProps {
    images: string[]
    productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (images.length === 0) {
        return (
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
                <span className="text-muted-foreground text-xl">No Image</span>
            </div>
        )
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden border group">
                <img
                    src={images[currentIndex]}
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    className="h-full w-full object-cover"
                />

                {/* Navigation Arrows - Only show if multiple images */}
                {images.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToPrevious}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={goToNext}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Grid - Only show if multiple images */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "aspect-square relative rounded-md overflow-hidden border-2 transition-all",
                                currentIndex === index
                                    ? "border-primary ring-2 ring-primary"
                                    : "border-transparent hover:border-muted-foreground"
                            )}
                        >
                            <img
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
