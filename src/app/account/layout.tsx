import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { signOut } from "@/auth"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 py-10">
            <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                <div className="h-full py-6 pr-6 lg:py-8">
                    <h2 className="mb-4 text-lg font-semibold tracking-tight">Account</h2>
                    <nav className="flex flex-col space-y-1">
                        <Link href="/account">
                            <Button variant="ghost" className="w-full justify-start">Overview</Button>
                        </Link>
                        <Link href="/account/profile">
                            <Button variant="ghost" className="w-full justify-start">My Profile</Button>
                        </Link>
                        <Link href="/account/orders">
                            <Button variant="ghost" className="w-full justify-start">My Orders</Button>
                        </Link>
                        <Link href="/account/addresses">
                            <Button variant="ghost" className="w-full justify-start">Addresses</Button>
                        </Link>
                        <Separator className="my-2" />
                        <form action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}>
                            <Button type="submit" variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50">
                                Sign Out
                            </Button>
                        </form>
                    </nav>
                </div>
            </aside>
            <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                <div className="mx-auto w-full min-w-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
