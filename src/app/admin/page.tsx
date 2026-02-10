import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, AlertTriangle, Package, TrendingUp, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default async function AdminDashboard() {
    // Get today's start and end
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Total Revenue (all time)
    const totalRevenue = await prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
    })

    // Total Orders
    const totalOrders = await prisma.order.count()

    // Orders Today
    const ordersToday = await prisma.order.count({
        where: {
            createdAt: { gte: today, lt: tomorrow },
        },
    })

    // Pending Orders
    const pendingOrders = await prisma.order.count({
        where: { status: "PENDING" },
    })

    // Low Stock Products (stock <= 5)
    const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lte: 5 } },
        orderBy: { stock: "asc" },
        take: 5,
    })

    // Recent Orders
    const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { _count: { select: { items: true } } },
    })

    const revenue = totalRevenue._sum.totalAmount ? Number(totalRevenue._sum.totalAmount) : 0

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Tk. {revenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All time sales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">{ordersToday} today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lowStockProducts.length}</div>
                        <p className="text-xs text-muted-foreground">Products need restock</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Orders</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/orders">View All</Link>
                            </Button>
                        </div>
                        <CardDescription>Latest orders from customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">No orders yet</p>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between">
                                        <div>
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                #{order.orderNumber}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                {order.customerName} • {order._count.items} item(s)
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={order.status === "PENDING" ? "secondary" : "default"}>
                                                {order.status}
                                            </Badge>
                                            <p className="text-sm font-medium mt-1">
                                                Tk. {Number(order.totalAmount).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Low Stock Alert */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Low Stock Alert</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/products">Manage</Link>
                            </Button>
                        </div>
                        <CardDescription>Products with 5 or fewer items</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {lowStockProducts.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">All products well stocked</p>
                        ) : (
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div>
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {product.name}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                Tk. {Number(product.price).toLocaleString()}
                                            </p>
                                        </div>
                                        <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                                            {product.stock === 0 ? "Out of Stock" : `${product.stock} left`}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
