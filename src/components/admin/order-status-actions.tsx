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
import { updateOrderStatus, cancelOrder, deleteOrder } from "@/app/actions/order-actions"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

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
    const [isCancelling, setIsCancelling] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const router = useRouter()

    const isCancelled = currentStatus === "CANCELLED"
    const isDelivered = currentStatus === "DELIVERED"
    const isLoading = isPending || isCancelling || isDeleting

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

    async function handleCancel() {
        setIsCancelling(true)
        try {
            const result = await cancelOrder(orderId)
            if (result.error) {
                toast.error(result.error)
                setIsCancelling(false)
                setShowConfirm(false)
            } else {
                toast.success("Order cancelled successfully")
                window.location.href = "/admin/orders"
            }
        } catch {
            toast.error("Failed to cancel order")
            setIsCancelling(false)
            setShowConfirm(false)
        }
    }

    async function handleDelete() {
        setIsDeleting(true)
        try {
            const result = await deleteOrder(orderId)
            if (result.error) {
                toast.error(result.error)
                setIsDeleting(false)
                setShowDeleteConfirm(false)
            } else {
                toast.success("Order deleted permanently")
                window.location.href = "/admin/orders"
            }
        } catch {
            toast.error("Failed to delete order")
            setIsDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    if (isCancelled) {
        return (
            <div className="space-y-4">
                <div className="text-center py-4 text-red-600 font-semibold">
                    ❌ This order has been cancelled and cannot be modified.
                </div>
                <div className="flex justify-center">
                    {!showDeleteConfirm ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Order
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 p-3 border border-red-300 rounded-lg bg-red-50">
                            <span className="text-sm text-red-700 font-medium">
                                Delete permanently? This removes the order from database.
                            </span>
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
                                No, Keep
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                    <Select value={status} onValueChange={setStatus} disabled={isLoading}>
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
                        disabled={isLoading || status === currentStatus}
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

                <div className="flex gap-2">
                    {!isDelivered && (
                        <div>
                            {!showConfirm ? (
                                <Button
                                    variant="destructive"
                                    disabled={isLoading}
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Cancel Order
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2 p-3 border border-red-300 rounded-lg bg-red-50">
                                    <span className="text-sm text-red-700 font-medium">
                                        Are you sure? This cannot be undone.
                                    </span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isCancelling}
                                    >
                                        {isCancelling ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : (
                                            "Yes, Cancel"
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowConfirm(false)}
                                        disabled={isCancelling}
                                    >
                                        No, Keep
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {!showDeleteConfirm ? (
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 p-3 border border-red-300 rounded-lg bg-red-50">
                            <span className="text-sm text-red-700 font-medium">
                                Delete permanently from database?
                            </span>
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
                    )}
                </div>
            </div>
        </div>
    )
}
