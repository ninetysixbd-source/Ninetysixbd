import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-20 max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-wider">About Us</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Ninetysix Lifestyle exists at the intersection of restraint and attitude.
                </p>
            </div>

            <div className="space-y-16">
                {/* Brand Philosophy */}
                <section className="prose prose-lg dark:prose-invert max-w-none text-center">
                    <p className="text-2xl font-medium text-foreground mb-8">
                        "We design with intention, stripping fashion down to its essentials — form, fit, and feeling. No noise. No excess. Just clarity."
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Rooted in Narayanganj and operating online, our brand reflects a contemporary state of mind shaped by modern culture, discipline, and self-expression.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        Every piece we create is thoughtfully designed, focusing on balance, comfort, and character. From fabric selection to fit and finish, we pay close attention to the details that matter, ensuring each garment carries both quality and intention.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                        We don’t chase fast trends or seasonal noise. Instead, we design timeless essentials — pieces meant to be worn often, styled effortlessly, and lived in fully. Our clothing is created for those who value confidence, control, and quiet strength in the way they dress and move through life.
                    </p>
                </section>

                {/* Why Choose Us */}
                <section className="bg-muted/30 p-10 rounded-3xl border">
                    <h2 className="text-3xl font-bold text-center mb-10">Why Choose Ninetysix?</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="h-2 w-2 mt-2.5 rounded-full bg-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Premium & Luxury Quality</h3>
                                <p className="text-muted-foreground">With a clean finish.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-2 w-2 mt-2.5 rounded-full bg-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Simple Ordering</h3>
                                <p className="text-muted-foreground">Secure payments, and reliable delivery.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-2 w-2 mt-2.5 rounded-full bg-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Imported Fabrics</h3>
                                <p className="text-muted-foreground">We always provide imported fabrics and make them into local garments.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-2 w-2 mt-2.5 rounded-full bg-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Affordable Price</h3>
                                <p className="text-muted-foreground">Quality product with an affordable price tag.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-2 w-2 mt-2.5 rounded-full bg-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Easy Policy</h3>
                                <p className="text-muted-foreground">Easy return & exchange policy.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-2 w-2 mt-2.5 rounded-full bg-primary shrink-0" />
                            <div>
                                <h3 className="font-semibold text-lg">Fast Delivery</h3>
                                <p className="text-muted-foreground">Nationwide fast delivery services.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
