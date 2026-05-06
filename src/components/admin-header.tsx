"use client"

// import { UserButton } from "@/components/user-button"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "@/components/admin-sidebar"

export function AdminHeader() {
    return (
        <div className="flex items-center p-4 border-b h-16">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                    <AdminSidebar />
                </SheetContent>
            </Sheet>
            <div className="ml-auto flex items-center space-x-4">
                {/* User Button Placeholder - will implement properly later */}
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            </div>
        </div>
    )
}
