"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
    return (
        <footer className="w-full bg-white border-t pt-16 pb-8">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold tracking-widest ">NinetysixBD</span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Address: Tolla Shobujbag <br />
                            Fatullah, Narayanganj-1400
                        </p>
                        <div className="space-y-1 text-sm">
                            <p><span className="font-semibold">Email:</span> ninety6lifestyle@gmail.com</p>
                            <p><span className="font-semibold">Phone:</span> +880 162 1396715</p>
                        </div>
                        <Link href="#" className="inline-block text-sm font-semibold border-b border-black pb-0.5 hover:text-muted-foreground transition-colors">
                            Get direction ↗
                        </Link>
                        <div className="flex items-center space-x-4 pt-2">
                            <Link href="https://www.facebook.com/Ninety6.lifestyle/" target="_blank">
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="https://x.com/96lifestyle" target="_blank">
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="https://www.instagram.com/ninetysix.lifestyle/" target="_blank">
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                    <Instagram className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="https://www.tiktok.com/@ninetysix_lifestyle?lang=en" target="_blank">
                                <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                                    {/* Lucide doesn't have TikTok, utilizing a text label or generic video icon could be an option, but for now using a Music note as placeholder or just SVG if I had it. 
                                        Actually, let's just use the Button and maybe a text or different icon. 
                                        I'll use 'radix-icons' if available or just a generic icon. 
                                        Let's stick to standard lucide icons. I'll use `Video` or `Music` or just leave it as Linkedin but that's wrong.
                                        I will remove the 4th button's icon and put "TT" text or similar if I can't find a better one. 
                                        Wait, I can just use a simple SVG path inline. */}
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Help Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Help</h3>
                        <nav className="flex flex-col space-y-3 text-sm text-muted-foreground">
                            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            <Link href="/return-policy" className="hover:text-foreground transition-colors">Return & Exchange Policy</Link>
                            <Link href="/shipping-policy" className="hover:text-foreground transition-colors">Shipping Policy</Link>
                            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ's</Link>
                        </nav>
                    </div>

                    {/* Useful Links Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Useful Links</h3>
                        <nav className="flex flex-col space-y-3 text-sm text-muted-foreground">
                            <Link href="/products" className="hover:text-foreground transition-colors">Our Store</Link>
                            <Link href="/contact" className="hover:text-foreground transition-colors">Visit Our Store</Link>
                            <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
                            <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
                        </nav>
                    </div>

                    {/* Newsletter Column - Removed */}
                    {/* <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Sign Up for Email</h3>
                        ...
                    </div> */}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t text-sm text-muted-foreground">
                    <p>© NinetysixBD. All Rights Reserved</p>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        {/* Payment Icons Placeholders */}
                        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">PAYPAL</div>
                        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">MC</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
