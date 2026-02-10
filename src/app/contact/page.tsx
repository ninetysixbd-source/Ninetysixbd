import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="container py-12 md:py-20 max-w-5xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider">Contact Us</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    We're here to help. Reach out to us for any queries or visit our store.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Address</p>
                                    <p className="text-muted-foreground">
                                        Tolla Shobujbag, Fatullah<br />
                                        Narayanganj-1400, Bangladesh
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Phone</p>
                                    <a href="tel:+88016231396715" className="text-muted-foreground hover:text-primary transition-colors">
                                        +880 162 31396715
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Email</p>
                                    <a href="mailto:ninety6lifestyle@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                                        ninety6lifestyle@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="bg-muted/30 p-8 rounded-2xl border">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold mb-4">Visit Our Store</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Discover the world of Ninetysix Lifestyle, a refined online-based clothing brand rooted in Narayanganj. You’re welcome to visit our store and experience our thoughtfully crafted collections in person.
                        </p>

                        <div className="pt-4 border-t">
                            <div className="flex items-start gap-4">
                                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold mb-1">Opening Hours</p>
                                    <p className="text-muted-foreground">
                                        Daily from 10:00 AM to 9:00 PM
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2 italic">
                                        Offering you a personalized and elevated shopping experience.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* Map Integration Placeholder (Optional) */}
            {/* <div className="mt-16 h-80 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                Google Map Embed would go here
            </div> */}
        </div>
    )
}
