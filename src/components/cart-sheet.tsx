"use client"

import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter
} from "@/components/ui/sheet"
import { useCartStore } from "@/lib/store/cart"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useState, useEffect } from "react"
import { formatPrice } from "@/lib/utils"

export function CartSheet() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const [isMounted, setIsMounted] = useState(false)

    // Prevent hydration errors by waiting for mount
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return (
        <Button variant="ghost" size="icon">
            <ShoppingBag className="h-5 w-5" />
        </Button>
    )

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle>Cart ({itemCount} items)</SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />

                {items.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center space-y-2">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
                        <span className="text-lg font-medium text-muted-foreground">Your cart is empty</span>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 pr-6">
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 space-y-2">
                                    <div className="h-20 w-20 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                        {item.image ? "Img" : "No Img"}
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <span className="font-semibold line-clamp-1">{item.name}</span>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                                            {item.size && <span className="font-medium text-black">Size: {item.size}</span>}
                                            {item.size && item.color && <span>•</span>}
                                            {item.color && (
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium text-black">Color: {item.color}</span>
                                                    <span
                                                        className="inline-block h-3 w-3 rounded-full border border-black/10"
                                                        style={{ backgroundColor: item.color.toLowerCase() }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatPrice(item.price)}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}>
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-destructive" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}

                <div className="space-y-4 pr-6 pt-4">
                    <Separator />
                    <div className="space-y-1.5">
                        <div className="flex justify-between">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">{formatPrice(totalPrice())}</span>
                        </div>
                    </div>
                    <SheetFooter>
                        <Button className="w-full" asChild disabled={items.length === 0}>
                            <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    )
}
