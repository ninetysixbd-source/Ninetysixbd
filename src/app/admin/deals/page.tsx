import { prisma } from "@/lib/prisma"
import { DealForm } from "@/components/admin/deal-form"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteOffer } from "@/app/actions/deal-actions"

export default async function AdminDealsPage() {
    let offers = []
    try {
        offers = await prisma.offer.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (e) { }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Special Deals</h1>
                    <p className="text-muted-foreground">Manage homepage slider offers.</p>
                </div>

                <div className="space-y-4">
                    {offers.length === 0 && (
                        <div className="p-4 border rounded bg-white text-center text-muted-foreground">No active deals.</div>
                    )}
                    {offers.map((offer) => (
                        <div key={offer.id} className={`p-6 rounded-lg border ${offer.backgroundColor} relative group`}>
                            <h3 className="text-xl font-bold">{offer.title}</h3>
                            <p className="text-muted-foreground">{offer.description}</p>
                            {offer.expiresAt && (
                                <p className="text-xs mt-2 text-red-600 font-medium">Expires: {new Date(offer.expiresAt).toLocaleDateString()}</p>
                            )}

                            <form action={async () => {
                                "use server"
                                await deleteOffer(offer.id)
                            }} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="destructive" className="h-8 w-8">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-bold mb-4">Add New Deal</h2>
                    <DealForm />
                </div>
            </div>
        </div>
    )
}
