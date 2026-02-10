import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStatusActions } from "@/components/admin/order-status-actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrderDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function OrderDetailPage(props: OrderDetailPageProps) {
    const params = await props.params
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: { product: true },
            },
        },
    })

    if (!order) {
        notFound()
    }

    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        PENDING: "secondary",
        PROCESSING: "outline",
        SHIPPED: "outline",
        DELIVERED: "default",
        CANCELLED: "destructive",
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/orders">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
                        <p className="text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                            {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
                <Badge variant={statusColors[order.status] || "outline"} className="text-sm px-3 py-1">
                    {order.status}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">{order.customerName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{order.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{order.phone}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-muted-foreground">{order.address}</p>
                        <p className="text-muted-foreground">
                            {order.upazila ? `${order.upazila}, ` : ""}{order.district ? `${order.district}` : ""}
                        </p>
                        <p className="text-muted-foreground">
                            {order.city} - {order.zipCode}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                    <CardDescription>{order.items.length} item(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                SKU: {item.productId.slice(0, 8)}
                                            </p>
                                            {((item as any).size || (item as any).color) && (
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Variant: {[
                                                        (item as any).size ? `Size: ${(item as any).size}` : null,
                                                        (item as any).color ? `Color: ${(item as any).color}` : null
                                                    ].filter(Boolean).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        Tk. {Number(item.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        Tk. {(Number(item.price) * item.quantity).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>Tk. {Number(order.totalAmount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Tk. {Number(order.totalAmount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Status Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Update Status</CardTitle>
                    <CardDescription>Change the order status or cancel the order</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrderStatusActions orderId={order.id} currentStatus={order.status} />
                </CardContent>
            </Card>
        </div>
    )
}
