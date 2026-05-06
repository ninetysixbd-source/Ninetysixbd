import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

interface OrderConfirmationPageProps {
    params: Promise<{
        orderId: string
    }>
}

export default async function OrderConfirmationPage(props: OrderConfirmationPageProps) {
    const params = await props.params
    const order = await prisma.order.findFirst({
        where: { orderNumber: Number(params.orderId) },
        include: { items: true }
    })

    if (!order) {
        return (
            <div className="container flex flex-col items-center justify-center py-24 space-y-4">
                <h1 className="text-2xl font-bold">Order not found</h1>
                <p>The order #{params.orderId} does not exist.</p>
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container flex flex-col items-center justify-center py-16 md:py-24 space-y-8 text-center">
            <div className="rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle2 className="h-12 w-12" />
            </div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight">Order Placed Successfully!</h1>
                <p className="text-muted-foreground">
                    Thank you for your purchase, <span className="font-semibold text-foreground">{order.customerName}</span>.
                    Your order <span className="font-semibold text-foreground">#{order.orderNumber}</span> has been confirmed.
                </p>
                <p className="text-sm text-muted-foreground">
                    We will contact you at {order.phone} regarding delivery.
                </p>
            </div>

            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        </div>
    )
}
