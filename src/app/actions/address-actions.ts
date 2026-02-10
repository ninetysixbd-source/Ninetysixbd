"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const addressSchema = z.object({
    label: z.string().min(1, "Label is required"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    upazila: z.string().min(1, "Area/Thana is required"),
    zipCode: z.string().min(1, "Zip code is required"),
    isDefault: z.boolean().optional(),
})

export type AddressFormValues = z.infer<typeof addressSchema>

async function requireUser() {
    const session = await auth()
    if (!session?.user?.id) {
        throw new Error("Unauthorized: Please sign in")
    }
    return session.user
}

export async function getAddresses() {
    const user = await requireUser()

    return prisma.address.findMany({
        where: { userId: user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })
}

export async function createAddress(data: AddressFormValues) {
    const user = await requireUser()
    const parsed = addressSchema.safeParse(data)

    if (!parsed.success) {
        return { error: "Invalid form data" }
    }

    // If this is the first address or marked as default, unset other defaults
    if (parsed.data.isDefault) {
        await prisma.address.updateMany({
            where: { userId: user.id },
            data: { isDefault: false },
        })
    }

    await prisma.address.create({
        data: {
            ...parsed.data,
            userId: user.id,
        },
    })

    revalidatePath("/account/addresses")
    return { success: true }
}

export async function updateAddress(id: string, data: AddressFormValues) {
    const user = await requireUser()
    const parsed = addressSchema.safeParse(data)

    if (!parsed.success) {
        return { error: "Invalid form data" }
    }

    // Verify ownership
    const address = await prisma.address.findFirst({
        where: { id, userId: user.id },
    })

    if (!address) {
        return { error: "Address not found" }
    }

    // If marking as default, unset other defaults
    if (parsed.data.isDefault) {
        await prisma.address.updateMany({
            where: { userId: user.id, id: { not: id } },
            data: { isDefault: false },
        })
    }

    await prisma.address.update({
        where: { id },
        data: parsed.data,
    })

    revalidatePath("/account/addresses")
    return { success: true }
}

export async function deleteAddress(id: string) {
    const user = await requireUser()

    // Verify ownership
    const address = await prisma.address.findFirst({
        where: { id, userId: user.id },
    })

    if (!address) {
        return { error: "Address not found" }
    }

    await prisma.address.delete({
        where: { id },
    })

    revalidatePath("/account/addresses")
    return { success: true }
}

export async function setDefaultAddress(id: string) {
    const user = await requireUser()

    // Verify ownership
    const address = await prisma.address.findFirst({
        where: { id, userId: user.id },
    })

    if (!address) {
        return { error: "Address not found" }
    }

    // Unset all defaults, then set this one
    await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
    })

    await prisma.address.update({
        where: { id },
        data: { isDefault: true },
    })

    revalidatePath("/account/addresses")
    return { success: true }
}
