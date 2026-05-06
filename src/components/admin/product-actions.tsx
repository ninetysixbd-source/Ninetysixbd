"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash, Edit, Loader2 } from "lucide-react"
import { useState } from "react"
import { deleteProduct } from "@/app/actions/product-actions"
import { toast } from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductActionsProps {
    productId: string
}

export function ProductActions({ productId }: ProductActionsProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteProduct(productId)
            if (result.error) {
                toast.error(result.error)
                setIsDeleting(false)
                setShowDeleteConfirm(false)
            } else {
                toast.success("Product deleted successfully")
                window.location.href = "/admin/products"
            }
        } catch {
            toast.error("Failed to delete product")
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/products/${productId}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {!showDeleteConfirm ? (
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onSelect={(e) => {
                                e.preventDefault()
                                setShowDeleteConfirm(true)
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    ) : (
                        <div className="p-2">
                            <div className="text-xs text-red-700 font-medium mb-2">
                                Delete permanently?
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Yes, Delete"
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
