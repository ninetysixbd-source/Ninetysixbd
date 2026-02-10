import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

interface EditProductPageProps {
    params: Promise<{
        productId: string
    }>
}

export default async function EditProductPage(props: EditProductPageProps) {
    const params = await props.params
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: params.productId },
        }),
        prisma.category.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    if (!product) {
        notFound()
    }

    // Transform Decimal to number for the form
    const formattedProduct = {
        ...product,
        price: Number(product.price),
        salePrice: product.salePrice ? Number(product.salePrice) : undefined,
        status: product.status as "DRAFT" | "PUBLISHED" | "ARCHIVED"
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
                    <p className="text-sm text-muted-foreground">
                        Update product details
                    </p>
                </div>
            </div>
            <div className="max-w-2xl">
                <ProductForm initialData={formattedProduct as any} categories={categories} />
            </div>
        </div>
    )
}
