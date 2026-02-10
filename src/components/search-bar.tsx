"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function SearchBar() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const router = useRouter()

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)
            setOpen(false)
            setQuery("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                    <Search className="h-6 w-6" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0">
                <DialogTitle className="sr-only">Search</DialogTitle>
                <form onSubmit={handleSearch} className="flex items-center">
                    <Search className="h-5 w-5 ml-4 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="flex-1 border-0 focus-visible:ring-0 text-lg py-6"
                        autoFocus
                    />
                    {query && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="mr-2"
                            onClick={() => setQuery("")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}
