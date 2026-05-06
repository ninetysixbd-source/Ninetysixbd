import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileNav } from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Providers } from "@/components/providers"
import { TrackingPixels } from "@/components/tracking-pixels"
import { prisma } from "@/lib/prisma"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NinetysixBD | Premium Fashion",
  description: "Modern E-commerce Store",
  other: {
    "facebook-domain-verification": "a0wmlf018g6wl0uhxi9s2r51ep5hg0",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: 'asc' }
  })

  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background antialiased overflow-x-hidden")}>
        <Providers>
          <SiteHeader categories={categories} />
          <div className="flex-1">
            {children}
          </div>
          <SiteFooter />
          <MobileNav />
          <Toaster />
          <Analytics />
          <SpeedInsights />
          <TrackingPixels />
        </Providers>
      </body>
    </html>
  )
}
