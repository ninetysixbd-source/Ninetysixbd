import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
    const { pathname } = req.nextUrl

    // Protect all /admin routes
    if (pathname.startsWith("/admin")) {
        // Not logged in
        if (!req.auth) {
            const signInUrl = new URL("/api/auth/signin", req.url)
            signInUrl.searchParams.set("callbackUrl", pathname)
            return NextResponse.redirect(signInUrl)
        }

        // Logged in but not ADMIN
        if (req.auth.user?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url))
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/admin/:path*"],
}
