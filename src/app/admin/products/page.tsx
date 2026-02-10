import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { Pagination } from "@/components/pagination"

const ITEMS_PER_PAGE = 20

interface AdminProductsPageProps {
    searchParams: Promise<{
        page?: string
    }>
}

export default async function AdminProductsPage(props: AdminProductsPageProps) {
    const searchParams = await props.searchParams
    const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10))

    const totalCount = await prisma.product.count()
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        include: { category: true },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">{totalCount} total products</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        )}
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category.name}</TableCell>
                                <TableCell>Tk. {Number(product.price).toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            product.status === "PUBLISHED"
                                                ? "default"
                                                : product.status === "DRAFT"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                    >
                                        {product.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/admin/products/${product.id}`}>Edit</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                baseUrl="/admin/products"
            />
        </div>
    )
}
