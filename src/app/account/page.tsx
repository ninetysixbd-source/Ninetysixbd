import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default async function AccountPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/api/auth/signin?callbackUrl=/account")
    }

    // Fetch real stats
    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
            items: true,
        },
    })

    const stats = await prisma.order.aggregate({
        where: { userId: session.user.id },
        _count: { id: true },
        _sum: { totalAmount: true },
    })

    const pendingCount = await prisma.order.count({
        where: { userId: session.user.id, status: "PENDING" },
    })

    const totalOrders = stats._count.id || 0
    const totalSpent = stats._sum.totalAmount ? Number(stats._sum.totalAmount) : 0

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile Overview</h3>
                <p className="text-sm text-muted-foreground">
                    Welcome back, {session.user.name || session.user.email}!
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                        <CardDescription>All time orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending</CardTitle>
                        <CardDescription>Orders in progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Spent</CardTitle>
                        <CardDescription>Lifetime value</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Tk. {totalSpent.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Recent Orders</h3>
                    <p className="text-sm text-muted-foreground">Your recent purchases.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/account/orders">View All</Link>
                </Button>
            </div>

            <div className="rounded-md border">
                {orders.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        No orders found. Start shopping!
                    </div>
                ) : (
                    <div className="divide-y">
                        {orders.map((order) => (
                            <div key={order.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Order #{order.orderNumber}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} item(s)
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={
                                        order.status === "PENDING" ? "secondary" :
                                            order.status === "DELIVERED" ? "default" : "outline"
                                    }>
                                        {order.status}
                                    </Badge>
                                    <span className="font-medium">
                                        Tk. {Number(order.totalAmount).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
