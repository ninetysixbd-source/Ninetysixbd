"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Check, MapPin, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AddressForm } from "@/components/address-form"
import { deleteAddress, setDefaultAddress } from "@/app/actions/user-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AddressBookProps {
    addresses: any[]
}

export function AddressBook({ addresses }: AddressBookProps) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        try {
            setLoadingId(id)
            await deleteAddress(id)
            toast.success("Address deleted")
            router.refresh() // Refresh to update list
        } catch (error) {
            toast.error("Failed to delete address")
        } finally {
            setLoadingId(null)
        }
    }

    const handleSetDefault = async (id: string) => {
        try {
            setLoadingId(id)
            await setDefaultAddress(id)
            toast.success("Default address updated")
            router.refresh()
        } catch (error) {
            toast.error("Failed to update default address")
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight">Address Book</h3>
                    <p className="text-muted-foreground">
                        Manage your shipping addresses.
                    </p>
                </div>
                <AddressForm>
                    <Button className="flex gap-2">
                        <Plus className="h-4 w-4" />
                        Add Address
                    </Button>
                </AddressForm>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                    <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                        <CardHeader className="relative">
                            {address.isDefault && (
                                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Default</Badge>
                            )}
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {address.label}
                            </CardTitle>
                            <CardDescription>{address.name}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <p>{address.address}</p>
                            <p>{address.city}, {address.zipCode}</p>
                            <p className="mt-2 text-muted-foreground">{address.phone}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                            <div className="flex gap-2">
                                <AddressForm initialData={address}>
                                    <Button variant="ghost" size="icon" disabled={loadingId === address.id}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </AddressForm>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(address.id)} className="text-destructive hover:text-destructive" disabled={loadingId === address.id}>
                                    {loadingId === address.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                            </div>
                            {!address.isDefault && (
                                <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} disabled={loadingId === address.id}>
                                    Set Default
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
                {addresses.length === 0 && (
                    <div className="col-span-full py-12 text-center border rounded-lg border-dashed text-muted-foreground">
                        <p>No addresses saved yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
