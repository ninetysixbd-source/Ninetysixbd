import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { redirect } from "next/navigation"
import { cancelMyOrder } from "@/app/actions/order-actions"

export default async function OrdersPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/api/auth/signin?callbackUrl=/account/orders")
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            items: true,
        },
    })

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Order History</h3>
                <p className="text-sm text-muted-foreground">View the status of your orders.</p>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableCaption>
                        {orders.length === 0
                            ? "You haven't placed any orders yet."
                            : `Showing ${orders.length} order(s)`
                        }
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No orders found. Start shopping!
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <Badge className="w-fit" variant={
                                                order.status === "PENDING" ? "secondary" :
                                                    order.status === "SHIPPED" ? "outline" :
                                                        order.status === "DELIVERED" ? "default" : "destructive"
                                            }>
                                                {order.status}
                                            </Badge>
                                            {order.status === "PENDING" && (
                                                <form action={async () => {
                                                    "use server"
                                                    await cancelMyOrder(order.id)
                                                }}>
                                                    <button className="text-xs text-red-500 hover:underline">
                                                        Cancel Order
                                                    </button>
                                                </form>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {order.items.map((item: any) => (
                                                <span key={item.id} className="text-sm">
                                                    {item.quantity}x {item.name}
                                                    {(item.size || item.color) && (
                                                        <span className="text-muted-foreground text-xs ml-1">
                                                            ({[item.size, item.color].filter(Boolean).join(", ")})
                                                        </span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        Tk. {Number(order.totalAmount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
