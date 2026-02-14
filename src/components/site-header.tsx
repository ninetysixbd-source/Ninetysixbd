"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Search, User, Heart, ChevronDown, Menu, Phone, Mail, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CartSheet } from "@/components/cart-sheet"
import { useState } from "react"
import { LoginDialog } from "@/components/auth/login-dialog"
import { RegisterDialog } from "@/components/auth/register-dialog"
import { useSession, signIn, signOut } from "next-auth/react"
import { SearchBar } from "@/components/search-bar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
// ... imports
import {
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
        DropdownMenuSub,
        DropdownMenuSubContent,
        DropdownMenuSubTrigger,
    } from "@/components/ui/dropdown-menu"

interface CategoryWithChildren {
    id: string
    name: string
    slug: string
    children: {
        id: string
        name: string
        slug: string
    }[]
}

interface SiteHeaderProps {
    categories?: CategoryWithChildren[]
}

export function SiteHeader({ categories = [] }: SiteHeaderProps) {
    const [loginOpen, setLoginOpen] = useState(false)
    const [registerOpen, setRegisterOpen] = useState(false)
    const { data: session, status } = useSession()

    const isAdmin = session?.user?.role === "ADMIN"

    return (
        <header className="sticky top-0 z-50 w-full bg-background border-b">
            <div className="container flex h-24 items-center justify-between">

                {/* Mobile Menu Trigger & Logo */}
                <div className="flex items-center md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-2">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                            <div className="flex flex-col h-full">
                                <SheetHeader className="p-6 border-b">
                                    <SheetTitle className="text-left text-2xl font-bold tracking-widest uppercase">Tabaz</SheetTitle>
                                </SheetHeader>

                                <div className="flex-1 overflow-auto py-4">
                                    <div className="px-6 space-y-1">
                                        <Link href="/" className="block py-3 text-lg font-medium text-red-600">Home</Link>

                                        <Accordion type="single" collapsible className="w-full border-none">
                                            <AccordionItem value="categories" className="border-b-0">
                                                <AccordionTrigger className="py-3 text-lg font-medium hover:no-underline font-bold">Categories</AccordionTrigger>
                                                <AccordionContent className="pl-4 space-y-2">
                                                    {categories.map((category) => (
                                                        <div key={category.id}>
                                                            <Link
                                                                href={`/products?category=${category.slug}`}
                                                                className="block py-2 text-base font-medium"
                                                            >
                                                                {category.name}
                                                            </Link>
                                                            {category.children && category.children.length > 0 && (
                                                                <div className="pl-4 space-y-1 border-l ml-1">
                                                                    {category.children.map((child) => (
                                                                        <Link
                                                                            key={child.id}
                                                                            href={`/products?category=${child.slug}`}
                                                                            className="block py-1 text-sm text-muted-foreground"
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {categories.length === 0 && (
                                                        <p className="text-sm text-muted-foreground">No categories found</p>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>

                                        <Link href="/products" className="block py-3 text-lg font-bold">All Products</Link>
                                        <Link href="/about" className="block py-3 text-lg font-bold">About Us</Link>

                                        {isAdmin && (
                                            // ... rest of the file
                                            <Link href="/admin" className="block py-3 text-lg font-bold text-primary">
                                                <Shield className="inline h-5 w-5 mr-2" />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    <div className="px-6 mt-6">
                                        {session ? (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-base font-medium border-b border-t-0 border-x-0 rounded-none px-0 h-auto py-3 hover:bg-transparent"
                                                onClick={() => signOut()}
                                            >
                                                Sign Out ({session.user?.name})
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-base font-medium border-b border-t-0 border-x-0 rounded-none px-0 h-auto py-3 hover:bg-transparent"
                                                onClick={() => setLoginOpen(true)}
                                            >
                                                Login/Registration
                                            </Button>
                                        )}
                                    </div>

                                    <div className="px-6 mt-8 space-y-4 text-sm text-muted-foreground">
                                        <p className="leading-relaxed">
                                            Address: Mahim ganguly road, Mina bazar, <br />
                                            Tan bazar, Narayanganj, <br />
                                            Dhaka,Bangladesh
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                <span className="text-black font-semibold">ninetysibd@gmail.com</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4" />
                                                <span className="text-black font-bold">(+880) 1896-063801</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Link href="/" className="flex items-center">
                        <Image src="/Logo.png" alt="NinetysixBd Logo" width={80} height={80} className="h-16 w-auto" />
                    </Link>
                </div>


                {/* Desktop Logo */}
                <Link href="/" className="hidden md:flex items-center">
                    <Image src="/Logo.png" alt="NinetysixBd Logo" width={120} height={120} className="h-20 w-auto" />
                </Link>

                {/* Main Navigation (Desktop) - Increased Size */}
                <nav className="hidden md:flex items-center space-x-10 text-base font-medium">
                    <Link href="/" className="transition-colors hover:text-black text-black font-semibold text-lg">Home</Link>
                    <Link href="/products" className="flex items-center space-x-1 cursor-pointer hover:text-black/70 font-semibold text-lg group">
                        <span>Shop</span>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger className="transition-colors hover:text-black/70 font-semibold text-lg flex items-center outline-none">
                            Categories <ChevronDown className="ml-1 h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href="/products">All Categories</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {categories.map((category) => (
                                category.children && category.children.length > 0 ? (
                                    <DropdownMenuSub key={category.id}>
                                        <DropdownMenuSubTrigger>
                                            <Link href={`/products?category=${category.slug}`} className="w-full block">
                                                {category.name}
                                            </Link>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            {category.children.map((child) => (
                                                <DropdownMenuItem key={child.id} asChild>
                                                    <Link href={`/products?category=${child.slug}`}>
                                                        {child.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                ) : (
                                    <DropdownMenuItem key={category.id} asChild>
                                        <Link href={`/products?category=${category.slug}`}>
                                            {category.name}
                                        </Link>
                                    </DropdownMenuItem>
                                )
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Link href="/about" className="transition-colors hover:text-black/70 font-semibold text-lg">About Us</Link>
                </nav>

                {/* Icons - Increased Size */}
                <div className="flex items-center space-x-2 md:space-x-6">
                    <SearchBar />

                    {/* User Menu with Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:flex hover:bg-transparent"
                            >
                                <User className="h-6 w-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {session ? (
                                <>
                                    <DropdownMenuItem disabled className="font-medium">
                                        {session.user?.name || session.user?.email}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account">My Account</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/orders">My Orders</Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href="/admin" className="text-primary font-medium">
                                                    <Shield className="h-4 w-4 mr-2" />
                                                    Admin Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        Sign Out
                                    </DropdownMenuItem>
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem onClick={() => signIn("google")}>
                                        Sign in with Google
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setLoginOpen(true)}>
                                        Sign in with Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setRegisterOpen(true)}>
                                        Create Account
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-transparent relative">
                        <Heart className="h-6 w-6" />
                        <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                            0
                        </span>
                    </Button>

                    <div className="relative">
                        <CartSheet />
                    </div>
                </div>
            </div>

            <LoginDialog
                open={loginOpen}
                onOpenChange={setLoginOpen}
                onRegisterClick={() => {
                    setLoginOpen(false)
                    setRegisterOpen(true)
                }}
            />

            <RegisterDialog
                open={registerOpen}
                onOpenChange={setRegisterOpen}
                onLoginClick={() => {
                    setRegisterOpen(false)
                    setLoginOpen(true)
                }}
            />
        </header>
    )
}
