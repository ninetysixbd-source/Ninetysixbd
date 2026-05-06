import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { AddressBook } from "@/components/address-book"
import { redirect } from "next/navigation"

export default async function AddressesPage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' }
        ]
    })

    return (
        <AddressBook addresses={addresses} />
    )
}
