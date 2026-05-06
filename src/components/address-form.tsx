"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { createAddress, updateAddress } from "@/app/actions/address-actions"
import { toast } from "sonner"
import { divisions, districtsData } from "@/lib/bangladesh-data"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const addressSchema = z.object({
    label: z.string().min(1, "Label is required"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    upazila: z.string().min(1, "Area/Upazila is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    isDefault: z.boolean().optional(),
})

interface AddressFormProps {
    children: React.ReactNode
    initialData?: {
        id: string
        label: string
        name: string
        phone: string
        address: string
        city: string
        district?: string | null
        upazila?: string | null
        zipCode: string
        isDefault: boolean
    }
}

export function AddressForm({ children, initialData }: AddressFormProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Filter districts based on selected city (Division)
    const [selectedCity, setSelectedCity] = useState(initialData?.city || "")
    const availableDistricts = selectedCity ? districtsData[selectedCity] || [] : []

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: initialData ? {
            label: initialData.label,
            name: initialData.name,
            phone: initialData.phone,
            address: initialData.address,
            city: initialData.city,
            district: initialData.district || "",
            upazila: initialData.upazila || "",
            zipCode: initialData.zipCode,
            isDefault: initialData.isDefault,
        } : {
            label: "Home",
            name: "",
            phone: "",
            address: "",
            city: "",
            district: "",
            upazila: "",
            zipCode: "",
            isDefault: false,
        },
    })

    // Watch for city changes to reset or update district availability
    const watchedCity = form.watch("city")
    if (watchedCity !== selectedCity) {
        setSelectedCity(watchedCity)
        // Reset district if city changes and old district is not valid for new city
        // (Optional refinement: strict reset or keep if matching? Usually reset is safer)
        // form.setValue("district", "") 
    }

    function onSubmit(data: z.infer<typeof addressSchema>) {
        startTransition(async () => {
            const payload = { ...data, isDefault: !!data.isDefault }
            const result = initialData
                ? await updateAddress(initialData.id, payload)
                : await createAddress(payload)

            if (!result.success) {
                toast.error("Failed to save address")
            } else {
                toast.success(initialData ? "Address updated" : "Address added")
                setOpen(false)
                form.reset()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Address" : "Add New Address"}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update your delivery address." : "Add a new delivery address."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Home, Office, etc." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City (Division)</FormLabel>
                                        <Select onValueChange={(val) => {
                                            field.onChange(val);
                                            form.setValue("district", ""); // Reset district on city change
                                        }} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {divisions.map((division) => (
                                                    <SelectItem key={division} value={division}>
                                                        {division}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="district"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>District</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCity}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select District" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {availableDistricts.map((district) => (
                                                    <SelectItem key={district} value={district}>
                                                        {district}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="upazila"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Area / Upazila</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mirpur, Dhanmondi..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zip Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1200" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Address Details</FormLabel>
                                    <FormControl>
                                        <Input placeholder="House #, Road #, Flat #" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isDefault"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Set as default address</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Saving..." : initialData ? "Update Address" : "Add Address"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
