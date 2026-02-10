import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductImageGallery } from "@/components/product-image-gallery"
import { ProductInfo } from "@/components/product-info"

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params
    const productData = await prisma.product.findUnique({
        where: { slug: params.slug },
        include: { category: true }
    })

    if (!productData) {
        notFound()
    }

    const product = {
        ...productData,
        price: Number(productData.price),
        salePrice: productData.salePrice ? Number(productData.salePrice) : null,
        discountPercentage: (productData as any).discountPercentage as number | null,
        images: (productData as any).images as string[] || [] // Cast for now
    }

    return (
        <div className="container py-8 md:py-12">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                {/* Image Gallery */}
                <ProductImageGallery images={product.images} productName={product.name} />

                {/* Product Info */}
                <ProductInfo product={product} />
            </div>
        </div>
    )
}
