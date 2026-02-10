
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function OrderSuccessPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 text-center space-y-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
            <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
            <p className="text-muted-foreground max-w-md">
                Thank you for your purchase. Your order has been received and is being processed.
                You will receive a confirmation email shortly.
            </p>
            <div className="flex gap-4 mt-6">
                <Button asChild onClick={() => {
                    // In a real app, clear cart here if not already cleared
                }}>
                    <Link href="/products">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/account/orders">View Order</Link>
                </Button>
            </div>
        </div>
    )
}
