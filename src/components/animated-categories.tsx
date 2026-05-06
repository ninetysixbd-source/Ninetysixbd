"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getCategoryCardUrl } from "@/lib/imagekit"

interface CategoryItem {
    id: string
    name: string
    slug: string
    image: string | null
    productCount: number
}

interface AnimatedCategoriesProps {
    categories: CategoryItem[]
}

export function AnimatedCategories({ categories }: AnimatedCategoriesProps) {
    const sectionRef = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: "50px" }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className="relative py-14 md:py-20 overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-transparent pointer-events-none" />

            <div className="container relative px-4 md:px-6">
                {/* Section Header */}
                <div
                    className="flex flex-col items-center text-center mb-10 md:mb-14"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(30px)",
                        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 mb-3">
                        Explore
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Our Collections
                    </h2>
                    <div
                        className="mt-4 h-[2px] bg-black rounded-full"
                        style={{
                            width: isVisible ? "60px" : "0px",
                            transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
                        }}
                    />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.slug}`}
                            className="group relative block"
                            style={{
                                opacity: isVisible ? 1 : 0,
                                transform: isVisible
                                    ? "translateY(0) scale(1)"
                                    : "translateY(60px) scale(0.9)",
                                filter: isVisible ? "blur(0px)" : "blur(8px)",
                                transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.15 + index * 0.1}s`,
                            }}
                        >
                            {/* Card with glassmorphism */}
                            <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-translate-y-1">
                                {/* Image */}
                                <div className="aspect-[3/4] relative overflow-hidden">
                                    {category.image ? (
                                        <>
                                            <Image
                                                src={getCategoryCardUrl(category.image)}
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            />
                                            {/* Gradient overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                            <span className="text-4xl font-bold text-gray-400/50">
                                                {category.name[0]}
                                            </span>
                                        </div>
                                    )}

                                    {/* Category info — bottom of card */}
                                    <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5">
                                        <h3 className="text-white font-bold text-base sm:text-lg md:text-xl tracking-tight leading-tight">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center mt-1.5 gap-2">
                                            <span className="text-white/70 text-xs sm:text-sm font-medium">
                                                {category.productCount} {category.productCount === 1 ? "Product" : "Products"}
                                            </span>
                                            <span
                                                className="inline-flex items-center text-white text-xs font-medium"
                                                style={{
                                                    opacity: 0,
                                                    transform: "translateX(-8px)",
                                                    transition: "all 0.3s ease",
                                                }}
                                            >
                                                →
                                            </span>
                                        </div>
                                    </div>

                                    {/* Shimmer effect on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .group:hover span[style] {
                    opacity: 1 !important;
                    transform: translateX(0) !important;
                }
            `}</style>
        </section>
    )
}
