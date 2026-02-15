"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProductActionsProps {
    productId: string
}

export function ProductActions({ productId }: ProductActionsProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteProduct(productId)
            if (result?.error) {
                toast.error(result.error)
                setOpen(false)
            } else {
                toast.success("Product deleted successfully")
                setOpen(false)
                router.push("/admin/products")
            }
        } catch {
            toast.error("An unexpected error occurred while deleting the product")
            setOpen(false)
        } finally {
            setIsDeleting(false)
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
                    <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        onSelect={(e) => {
                            e.preventDefault()
                            setOpen(true)
                        }}
                    >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the product
                            and remove it from our servers.
                            <br /><br />
                            <span className="font-bold text-red-600">
                                Warning: This will also delete this product from any existing order history.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Product"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
