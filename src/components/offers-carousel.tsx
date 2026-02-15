"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })])
    const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
    const scrollTo = React.useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

    const onSelect = React.useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap())
        setPrevBtnEnabled(emblaApi.canScrollPrev())
        setNextBtnEnabled(emblaApi.canScrollNext())
    }, [])

    React.useEffect(() => {
        if (!emblaApi) return

        onSelect(emblaApi)
        setScrollSnaps(emblaApi.scrollSnapList())
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi, onSelect])

    if (!offers || offers.length === 0) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center bg-muted rounded-xl">
                <p className="text-muted-foreground">No active offers</p>
            </div>
        )
    }

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-xl group">
            <div className="h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {offers.map((offer) => (
                        <div key={offer.id} className={`relative flex-[0_0_100%] min-w-0 h-full ${!offer.image ? offer.backgroundColor : ''}`}>
                            {/* Background Image - Only show the image, no text overlay */}
                            {offer.image && (
                                <img
                                    src={offer.image}
                                    alt={offer.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
            >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous slide</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
            >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next slide</span>
            </Button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? "bg-primary" : "bg-primary/20"}`}
                        onClick={() => scrollTo(index)}
                    />
                ))}
            </div>
        </div>
    )
}
