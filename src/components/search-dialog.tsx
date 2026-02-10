"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { searchProducts } from "@/app/actions/search-actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SearchResult {
    categories: any[]
    products: any[]
}

export function SearchDialog() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 0) {
                setLoading(true)
                try {
                    const data = await searchProducts(query)
                    setResults(data)
                } catch (error) {
                    console.error("Search error:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setResults(null)
            }
        }, 300) // Debounce 300ms

        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (path: string) => {
        setOpen(false)
        router.push(path)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                    <Search className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
                <DialogTitle className="sr-only">Search</DialogTitle>
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Type to search..."
                            className="border-none shadow-none focus-visible:ring-0 text-lg px-0 h-auto"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {results && (
                        <div className="p-2 space-y-1">
                            {results.categories.length === 0 && results.products.length === 0 && (
                                <p className="text-sm text-center text-muted-foreground py-6">
                                    No results found.
                                </p>
                            )}

                            {results.categories.length > 0 && (
                                <div className="py-2">
                                    <h4 className="px-2 text-xs font-semibold text-muted-foreground mb-2">Categories</h4>
                                    {results.categories.map((category) => (
                                        <div
                                            key={category.id}
                                            onClick={() => handleSelect(`/products?category=${category.slug}`)}
                                            className="px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer flex items-center justify-between group"
                                        >
                                            <span className="font-medium">{category.name}</span>
                                            <span className="text-xs text-muted-foreground group-hover:text-foreground">Category</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {results.products.length > 0 && (
                                <div className="py-2">
                                    <h4 className="px-2 text-xs font-semibold text-muted-foreground mb-2">Products</h4>
                                    {results.products.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleSelect(`/product/${product.slug}`)}
                                            className="px-3 py-2 text-sm rounded-md hover:bg-muted cursor-pointer flex items-center justify-between group"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-medium">{product.name}</span>
                                                <span className="text-xs text-muted-foreground truncate max-w-[300px]">{product.description}</span>
                                            </div>
                                            <span className="font-semibold">৳{product.salePrice || product.price}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {!results && query.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            Start typing to search for products and categories...
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
