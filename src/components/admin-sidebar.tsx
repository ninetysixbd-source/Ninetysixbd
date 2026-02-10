"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Tag,
    Percent,
    LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"

const routes = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
    { href: "/admin/deals", label: "Special Deals", icon: Percent },
    { href: "/admin/users", label: "Users & Roles", icon: Users },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
            <div className="p-6 border-b border-gray-700">
                <Link href="/admin">
                    <h2 className="text-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        96BD Admin
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Management Portal</p>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-lg transition-all duration-200 group",
                            pathname === route.href && "bg-gray-700/50 text-white"
                        )}
                    >
                        <route.icon className={cn("h-5 w-5 group-hover:scale-110 transition-transform", pathname === route.href && "scale-110 text-blue-400")} />
                        <span className="font-medium">{route.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700 mt-auto">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-700/30 rounded-lg mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0">
                        {session?.user?.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Admin"}</p>
                        <p className="text-xs text-gray-400 truncate">{session?.user?.email || "admin@example.com"}</p>
                    </div>
                </div>

                <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-red-500/20"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
