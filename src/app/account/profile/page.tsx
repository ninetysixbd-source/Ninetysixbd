import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/profile-form"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user?.id) {
        redirect("/auth/signin")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            name: true,
            email: true,
            phone: true,
        }
    })

    if (!user) redirect("/")

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold tracking-tight">Profile</h3>
                <p className="text-muted-foreground">
                    Manage your account settings and personal information.
                </p>
            </div>
            <ProfileForm user={user} />
        </div>
    )
}
