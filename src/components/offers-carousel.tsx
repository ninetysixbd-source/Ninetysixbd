"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Offer {
    id: string
    title: string
    description: string
    backgroundColor: string
    image?: string | null
}

interface OffersCarouselProps {
    offers: Offer[]
}

export function OffersCarousel({ offers }: OffersCarouselProps) {
    // If no offers, show default or nothing
    if (!offers || offers.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center bg-muted rounded-xl">
                <p className="text-muted-foreground">No active offers</p>
            </div>
        )
    }

    // Use offers prop instead of OFFERS constant
    const OFFERS = offers
    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [isPaused, setIsPaused] = React.useState(false)

    const nextSlide = React.useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % offers.length)
    }, [offers.length])

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length)
    }

    React.useEffect(() => {
        if (isPaused) return

        const interval = setInterval(() => {
            nextSlide()
        }, 2000)

        return () => clearInterval(interval)
    }, [isPaused, nextSlide])

    return (
        <div
            className="relative w-full h-[400px] overflow-hidden rounded-xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className={`min-w-full h-full flex flex-col items-center justify-center p-8 text-center relative ${!offer.image ? offer.backgroundColor : 'bg-black/50'}`}
                    >
                        {/* Background Image */}
                        {offer.image && (
                            <>
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="absolute inset-0 w-full h-full object-cover -z-20"
                                />
                                {/* Overlay for readability */}
                                <div className="absolute inset-0 bg-black/40 -z-10" />
                            </>
                        )}

                        <div className="relative z-10 text-white">
                            <h2 className="text-4xl font-bold mb-4 drop-shadow-md">{offer.title}</h2>
                            <p className="text-xl mb-6 drop-shadow-md opacity-90">{offer.description}</p>
                            <Link href="/categories">
                                <Button className="bg-white text-black hover:bg-white/90" size="lg">Shop Now</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                onClick={prevSlide}
            >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous slide</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                onClick={nextSlide}
            >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next slide</span>
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {offers.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? "bg-primary" : "bg-primary/20"
                            }`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    )
}
