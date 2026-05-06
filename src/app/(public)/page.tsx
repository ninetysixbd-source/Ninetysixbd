import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
    return (
        <div className="flex flex-col gap-10 pb-10">
            {/* Hero Section */}
            <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-slate-50">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Elevate Your Style with <span className="text-primary">Ninetysix</span>
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        Discover the latest trends in premium fashion. Quality materials, sustainable production, and timeless designs.
                    </p>
                    <div className="space-x-4">
                        <Button size="lg" asChild>
                            <Link href="/products">Shop Now</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/products?category=sale">View Sale</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Categories (Placeholder) */}
            <section className="container space-y-6">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">Featured Categories</h2>
                </div>
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    {/* Cards will go here */}
                </div>
            </section>
        </div>
    )
}
