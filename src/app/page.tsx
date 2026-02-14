import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Truck, ShieldCheck, Tag } from "lucide-react"
import { OffersCarousel } from "@/components/offers-carousel"
import { ProductCard } from "@/components/product-card"
import { SerializableProduct } from "@/lib/types"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"

// Helper to convert Prisma product to SerializableProduct
function serializeProduct(product: any): SerializableProduct {
  return {
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    discountPercentage: product.discountPercentage ?? null,
    images: product.images || []
  }
}

export const revalidate = 60 // Revalidate every minute

export default async function Home() {
  const [offers, featuredProductsData, dealProductsData, categories] = await Promise.all([
    // Fetch offers
    (prisma as any).offer.findMany({
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),

    // Fetch featured products (newest 8)
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 8
    }),

    // Fetch deals (products with discount)
    prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        discountPercentage: { gt: 0 }
      } as any,
      orderBy: { discountPercentage: 'desc' } as any,
      take: 4
    }),

    // Fetch categories with product count and one image
    prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        },
        products: {
          take: 1
        }
      },
      orderBy: { name: 'asc' }
    })
  ])

  const featuredProducts = featuredProductsData.map((p: any) => serializeProduct(p))
  const dealProducts = dealProductsData.map((p: any) => serializeProduct(p))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container py-8">
        <OffersCarousel offers={offers} />
      </section>

      {/* Deals of the Week */}
      {dealProducts.length > 0 && (
        <section className="container py-12 bg-red-50/50 dark:bg-red-950/10 rounded-3xl my-8">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <Badge variant="destructive" className="px-4 py-1 text-base">Limited Time Offers</Badge>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Deals of the Week</h2>
            <p className="max-w-[900px] text-muted-foreground">Grab these amazing discounts before they're gone!</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline" className="border-red-200 hover:bg-red-50 text-red-600">
              <Link href="/products?sort=discount" className="flex items-center gap-2">
                View All Deals <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">New Arrivals</h2>
          <p className="max-w-[900px] text-muted-foreground">Check out our latest collection.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Button asChild size="lg">
            <Link href="/products">Shop All Products</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-12 md:py-24 lg:py-32">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Premium Quality</h3>
            <p className="text-muted-foreground">Hand-picked fabrics and meticulous stitching for lasting comfort.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Fast Delivery</h3>
            <p className="text-muted-foreground">Nationwide delivery within 2-3 business days.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg bg-card hover:shadow-lg transition-shadow">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Secure Payment</h3>
            <p className="text-muted-foreground">Cash on Delivery and secure digital payment options.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories Preview */}
      <section className="bg-muted/40 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Curated Collections</h2>
            <p className="max-w-[900px] text-muted-foreground">Browse our most popular categories.</p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
            {categories.map((category: any) => {
              const bgImage = category.products[0]?.images[0]

              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-lg bg-background shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-500 relative">
                    {bgImage ? (
                      <>
                        <img
                          src={bgImage}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </>
                    ) : (
                      <span className="text-lg font-medium">{category.name}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-white text-xl font-bold group-hover:underline">{category.name}</h3>
                    <p className="text-gray-300 text-sm mt-1">{category._count.products} Products</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Graffiti Banner */}
      <section className="container py-12">
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl shadow-2xl">
          <img
            src="/ninetysix-banner.jpg"
            alt="NinetySix Graffiti Art"
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>
    </div>
  )
}
