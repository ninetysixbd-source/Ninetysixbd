import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { Pagination } from "@/components/pagination"

const ITEMS_PER_PAGE = 20

import { OrderSearch } from "@/components/admin/order-search"

// ... imports

interface AdminOrdersPageProps {
    searchParams: Promise<{
        page?: string
        search?: string
    }>
}

export default async function AdminOrdersPage(props: AdminOrdersPageProps) {
    const searchParams = await props.searchParams
    const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10))
    const searchTerm = searchParams?.search || ""

    // Build Where Clause
    const whereClause: any = {}

    if (searchTerm) {
        const numericSearch = parseInt(searchTerm)
        const isNumeric = !isNaN(numericSearch)

        whereClause.OR = [
            { customerName: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            // Add ID search if it matches CUID format or just ignored if we only do int orderNumber
            { id: { contains: searchTerm, mode: "insensitive" } }
        ]

        if (isNumeric) {
            whereClause.OR.push({ orderNumber: numericSearch })
        }
    }

    const totalCount = await prisma.order.count({ where: whereClause })
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    const orders = await prisma.order.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        include: {
            _count: { select: { items: true } },
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">{totalCount} total orders</p>
                </div>
                <OrderSearch />
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground">{order.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === "CANCELLED"
                                                    ? "destructive"
                                                    : order.status === "PENDING"
                                                        ? "secondary"
                                                        : order.status === "DELIVERED"
                                                            ? "default"
                                                            : "outline"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{order._count.items}</TableCell>
                                    <TableCell>Tk. {Number(order.totalAmount).toFixed(2)}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                baseUrl="/admin/orders"
            />
        </div>
    )
}
