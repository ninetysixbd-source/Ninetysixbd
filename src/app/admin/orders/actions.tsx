"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { updateOrderStatus } from "@/app/actions/order-actions"
import { toast } from "sonner"
import { useState } from "react"

export function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)

    const handleUpdate = async (status: string) => {
        setLoading(true)
        const res = await updateOrderStatus(orderId, status)
        setLoading(false)

        if (res.success) {
            toast.success(`Order ${status.toLowerCase()}`)
        } else {
            toast.error(res.error)
        }
    }

    if (currentStatus === "CANCELLED" || currentStatus === "DELIVERED") return null

    return (
        <div className="flex justify-end gap-2">
            {currentStatus !== "CONFIRMED" && (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleUpdate("CONFIRMED")}
                    disabled={loading}
                >
                    <Check className="h-4 w-4" />
                </Button>
            )}
            <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleUpdate("CANCELLED")}
                disabled={loading}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
