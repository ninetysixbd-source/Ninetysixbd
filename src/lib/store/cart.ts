import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    image?: string
    quantity: number
    productId: string
    size?: string
    color?: string
}

interface CartState {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (itemId: string) => void
    updateQuantity: (itemId: string, quantity: number) => void
    clearCart: () => void
    totalItems: () => number
    totalPrice: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const currentItems = get().items
                // Check if item exists with same Product ID, Size AND Color
                const existingItem = currentItems.find((item) =>
                    item.productId === newItem.productId &&
                    item.size === newItem.size &&
                    item.color === newItem.color
                )

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            (item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color)
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                    })
                } else {
                    set({ items: [...currentItems, newItem] })
                }
            },
            removeItem: (itemId) => {
                set({ items: get().items.filter((item) => item.id !== itemId) })
            },
            updateQuantity: (itemId, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                })
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
