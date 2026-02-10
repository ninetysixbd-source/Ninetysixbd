import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: {
            name: 'asc'
        },
        include: {
            _count: {
                select: { products: true }
            }
        }
    })

    return (
        <div className="container py-10 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase tracking-wide">All Categories</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold uppercase tracking-wider group-hover:text-red-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-muted-foreground mt-2">
                                    {category._count.products} Products
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                <ArrowRight className="h-5 w-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {categories.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <p>No categories found.</p>
                </div>
            )}
        </div>
    )
}
