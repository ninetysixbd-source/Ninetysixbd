import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Truck, ShieldCheck, Tag, Percent } from "lucide-react"
import { OffersCarousel } from "@/components/offers-carousel"
import { ProductCard } from "@/components/product-card"
import { SerializableProduct } from "@/lib/types"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { BlurImage } from "@/components/blur-image"
import { AnimatedCategories } from "@/components/animated-categories"

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
  const [offers, featuredProductsData, specialDealsData, categories] = await Promise.all([
    // Fetch offers
    (prisma as any).offer.findMany({
      orderBy: { createdAt: 'desc' }
    }).catch(() => []),

    // Fetch featured products (admin-controlled, in-stock only, newest first, max 8)
    prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
        inStock: true,
        stock: { gt: 0 }
      } as any,
      orderBy: { createdAt: 'desc' },
      take: 8
    }),


    // Fetch special deal products — in-stock only, newest first
    prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        isSpecialDeal: true,
        inStock: true,
        stock: { gt: 0 }
      } as any,
      orderBy: { createdAt: 'desc' },
      take: 8
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

  const specialDeals = specialDealsData.map((p: any) => serializeProduct(p))

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full">
        <OffersCarousel offers={offers} />
      </section>

      {/* Animated Categories — right after carousel */}
      {categories.length > 0 && (
        <AnimatedCategories
          categories={categories.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.products[0]?.images[0] ?? null,
            productCount: c._count.products,
          }))}
        />
      )}

      {/* Featured Products (New Arrivals) */}
      {featuredProducts.length > 0 && (
        <section className="container py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">New Arrivals</h2>
            <p className="max-w-[900px] text-muted-foreground">Check out our latest collection.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product: any, index: number) => (
              <div key={product.id} className={index >= 4 ? "hidden lg:block h-full" : "h-full"}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button asChild size="lg">
              <Link href="/products">Show All Products</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Special Deals */}
      {specialDeals.length > 0 && (
        <section className="container py-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="flex items-center gap-2">
              <Tag className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Special Deals</h2>
            </div>
            <p className="max-w-[900px] text-muted-foreground">Exclusive hand-picked deals just for you.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {specialDeals.map((product: any, index: number) => (
              <div key={product.id} className={index >= 4 ? "hidden lg:block h-full" : "h-full"}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button asChild size="lg" variant="outline" className="border-primary hover:bg-primary/5 text-primary">
              <Link href="/products?sort=deal">View Special Deals</Link>
            </Button>
          </div>
        </section>
      )}


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



      {/* Graffiti Banner */}
      <section className="w-full">
        <div className="w-full">
          <Image
            src="/ninetysix-banner.jpg"
            alt="NinetySix Graffiti Art"
            width={1920}
            height={800}
            className="w-full h-auto hover:brightness-105 transition-all duration-700"
            priority={false}
          />
        </div>
      </section>
    </div>
  )
}
