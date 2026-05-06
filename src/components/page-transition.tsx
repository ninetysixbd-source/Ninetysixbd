"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [navigating, setNavigating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [barVisible, setBarVisible] = useState(false)
    const [isBlurred, setIsBlurred] = useState(false)
    const prevPathRef = useRef(pathname)
    const prevSearchRef = useRef(searchParams?.toString())
    const isInitialLoad = useRef(true)

    const startLoading = useCallback(() => {
        // Don't blur on initial page load
        if (isInitialLoad.current) return

        setNavigating(true)
        setBarVisible(true)
        setProgress(0)
        setIsBlurred(true)
    }, [])

    // Mark initial load as complete after first render
    useEffect(() => {
        isInitialLoad.current = false
    }, [])

    // Detect route completion — pathname/searchParams changed means new page loaded
    useEffect(() => {
        const currentSearch = searchParams?.toString() || ""
        if (prevPathRef.current !== pathname || prevSearchRef.current !== currentSearch) {
            prevPathRef.current = pathname
            prevSearchRef.current = currentSearch

            if (navigating) {
                // Route finished loading → clear blur and complete progress bar
                setProgress(100)
                setIsBlurred(false)

                const timer = setTimeout(() => {
                    setBarVisible(false)
                    setNavigating(false)
                    setProgress(0)
                }, 400)
                return () => clearTimeout(timer)
            }
        }
    }, [pathname, searchParams, navigating])

    // Animate progress bar while navigating
    useEffect(() => {
        if (!navigating) return

        const intervals = [
            setTimeout(() => setProgress(30), 100),
            setTimeout(() => setProgress(50), 300),
            setTimeout(() => setProgress(70), 600),
            setTimeout(() => setProgress(85), 1200),
            setTimeout(() => setProgress(90), 2500),
        ]

        return () => intervals.forEach(clearTimeout)
    }, [navigating])

    // Listen for link clicks to start transition
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a")
            if (!anchor) return

            const href = anchor.getAttribute("href")
            if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) return

            const url = new URL(href, window.location.origin)
            if (url.origin !== window.location.origin) return
            if (url.pathname === pathname && url.search === window.location.search) return

            startLoading()
        }

        document.addEventListener("click", handleClick, true)
        return () => document.removeEventListener("click", handleClick, true)
    }, [pathname, startLoading])

    return (
        <>
            {/* Top progress bar */}
            {barVisible && (
                <div
                    className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
                    role="progressbar"
                    aria-valuenow={progress}
                >
                    <div
                        className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        style={{
                            width: `${progress}%`,
                            transition: progress === 100
                                ? "width 200ms ease-out, opacity 300ms ease-out 100ms"
                                : "width 500ms ease-out",
                            opacity: progress === 100 ? 0 : 1,
                        }}
                    />
                </div>
            )}

            {/* Page content with Tailwind transition */}
            <div
                className={cn(
                    "transition-all duration-300",
                    isBlurred ? "opacity-50" : "opacity-100"
                )}
            >
                {children}
            </div>
        </>
    )
}
