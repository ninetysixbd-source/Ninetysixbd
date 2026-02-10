"use client"

import Link from "next/link"
import { Home, Grid, ShoppingBag, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full bg-background border-t md:hidden">
            <div className="grid grid-cols-4 h-16">
                <Link
                    href="/"
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                        pathname === "/" && "text-foreground bg-muted/20"
                    )}
                >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                </Link>
                <Link
                    href="/products"
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                        pathname.startsWith("/products") && "text-foreground bg-muted/20"
                    )}
                >
                    <Grid className="h-5 w-5" />
                    <span>Shop</span>
                </Link>
                <Link
                    href="/cart"
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                        pathname === "/cart" && "text-foreground bg-muted/20"
                    )}
                >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Cart</span>
                </Link>
                <Link
                    href="/account"
                    className={cn(
                        "flex flex-col items-center justify-center space-y-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                        pathname.startsWith("/account") && "text-foreground bg-muted/20"
                    )}
                >
                    <User className="h-5 w-5" />
                    <span>Account</span>
                </Link>
            </div>
        </div>
    )
}
