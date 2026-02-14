"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { updateOrderStatus, cancelOrder } from "@/app/actions/order-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface OrderStatusActionsProps {
    orderId: string
    currentStatus: string
}

const STATUS_OPTIONS = [
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
]

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
    const [status, setStatus] = useState(currentStatus)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const [isCancelOpen, setIsCancelOpen] = useState(false)

    const isCancelled = currentStatus === "CANCELLED"
    const isDelivered = currentStatus === "DELIVERED"

    function handleStatusUpdate() {
        if (status === currentStatus) return

        startTransition(async () => {
            const result = await updateOrderStatus(orderId, status)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success(`Order status updated to ${status}`)
                router.refresh()
            }
        })
    }

    function handleCancel(e: React.MouseEvent) {
        e.preventDefault()

        startTransition(async () => {
            const result = await cancelOrder(orderId)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Order cancelled successfully")
                setIsCancelOpen(false)
                router.refresh()
            }
        })
    }

    if (isCancelled) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                This order has been cancelled and cannot be modified.
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
                <Select value={status} onValueChange={setStatus} disabled={isPending}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    onClick={handleStatusUpdate}
                    disabled={isPending || status === currentStatus}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Status"
                    )}
                </Button>
            </div>

            {!isDelivered && (
                <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isPending}>
                            Cancel Order
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. The order will be marked as cancelled
                                and the customer will need to place a new order.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>Keep Order</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCancel}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cancelling...
                                    </>
                                ) : (
                                    "Yes, Cancel Order"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}
