"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { hash } from "bcryptjs"
import { generatePasswordResetToken, getPasswordResetTokenByToken } from "@/lib/tokens"
import { sendPasswordResetEmail } from "@/lib/mail"


// Profile Schema
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
})

export async function updateProfile(data: z.infer<typeof profileSchema>) {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const validated = profileSchema.parse(data)

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: validated.name,
            phone: validated.phone,
        },
    })

    revalidatePath("/account/profile")
    return { success: true }
}

// Address Schemas
const addressSchema = z.object({
    label: z.string().min(1, "Label is required"),
    name: z.string().min(1, "Recipient name is required"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(1, "City is required"),
    district: z.string().min(1, "District is required"),
    upazila: z.string().min(1, "Area/Upazila is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    isDefault: z.boolean().default(false),
})

export async function addAddress(data: z.infer<typeof addressSchema>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const validated = addressSchema.parse(data)

    // If set to default, unset other defaults
    if (validated.isDefault) {
        await prisma.address.updateMany({
            where: { userId: session.user.id, isDefault: true },
            data: { isDefault: false },
        })
    }

    // If this is the FIRST address, force it to be default
    const count = await prisma.address.count({ where: { userId: session.user.id } })
    const isDefault = count === 0 ? true : validated.isDefault

    await prisma.address.create({
        data: {
            ...validated,
            userId: session.user.id,
            isDefault,
        },
    })

    revalidatePath("/account/addresses")
    return { success: true }
}

export async function updateAddress(id: string, data: z.infer<typeof addressSchema>) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const validated = addressSchema.parse(data)

    // Verify ownership
    const existing = await prisma.address.findUnique({
        where: { id, userId: session.user.id },
    })
    if (!existing) throw new Error("Address not found")

    if (validated.isDefault && !existing.isDefault) {
        await prisma.address.updateMany({
            where: { userId: session.user.id, isDefault: true },
            data: { isDefault: false },
        })
    }

    await prisma.address.update({
        where: { id },
        data: validated,
    })

    revalidatePath("/account/addresses")
    return { success: true }
}

export async function deleteAddress(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.address.delete({
        where: { id, userId: session.user.id },
    })

    revalidatePath("/account/addresses")
    return { success: true }
}

export async function setDefaultAddress(id: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    await prisma.$transaction([
        prisma.address.updateMany({
            where: { userId: session.user.id, isDefault: true },
            data: { isDefault: false },
        }),
        prisma.address.update({
            where: { id, userId: session.user.id },
            data: { isDefault: true },
        }),
    ])

    revalidatePath("/account/addresses")
    return { success: true }
}

// Register Schema
const registerSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function registerUser(data: z.infer<typeof registerSchema>) {
    const validated = registerSchema.safeParse(data)

    if (!validated.success) {
        return { error: "Invalid input data" }
    }

    const { firstName, lastName, email, password } = validated.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "User already exists" }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.create({
        data: {
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
        },
    })

    return { success: true }
}

// ----------------------------------------------------------------------
// Password Reset Actions
// ----------------------------------------------------------------------

const forgotPasswordSchema = z.object({
    email: z.string().email(),
})

export async function forgotPassword(data: z.infer<typeof forgotPasswordSchema>) {
    const validated = forgotPasswordSchema.safeParse(data)
    if (!validated.success) return { error: "Invalid email address" }

    const { email } = validated.data

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    // Secure: Always return success even if user doesn't exist
    if (!existingUser) {
        // You might want to log this for debugging
        console.log(`[Forgot Password] Email ${email} not found.`)
        return { success: true }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: true }
}

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is missing"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export async function resetPassword(data: z.infer<typeof resetPasswordSchema>) {
    const validated = resetPasswordSchema.safeParse(data)
    if (!validated.success) return { error: "Invalid data" }

    const { token, password } = validated.data

    const existingToken = await getPasswordResetTokenByToken(token)

    if (!existingToken) {
        return { error: "Invalid token!" }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { error: "Token has expired!" }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email },
    })

    if (!existingUser) {
        return { error: "Email does not exist!" }
    }

    const hashedPassword = await hash(password, 10)

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id },
    })

    return { success: "Password updated!" }
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'USER') {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role },
        })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (e) {
        return { error: "Failed to update role" }
    }
}

const userProfileSchema = z.object({
    name: z.string().optional(),
    password: z.string().optional(),
})

export async function updateUserProfile(userId: string, data: z.infer<typeof userProfileSchema>) {
    const session = await auth()
    if (!session?.user?.id || session.user.id !== userId) {
        throw new Error("Unauthorized")
    }

    const validated = userProfileSchema.parse(data)
    const updateData: any = {}

    if (validated.name) updateData.name = validated.name
    if (validated.password) {
        updateData.password = await hash(validated.password, 10)
    }

    await prisma.user.update({
        where: { id: userId },
        data: updateData,
    })

    revalidatePath("/account")
    return { success: true }
}

const userAddressSchema = z.object({
    presentAddress: z.string().optional(),
    permanentAddress: z.string().optional(),
})

export async function updateUserAddress(userId: string, data: z.infer<typeof userAddressSchema>) {
    const session = await auth()
    if (!session?.user?.id || session.user.id !== userId) {
        throw new Error("Unauthorized")
    }

    const validated = userAddressSchema.parse(data)

    await prisma.user.update({
        where: { id: userId },
        data: {
            presentAddress: validated.presentAddress,
            permanentAddress: validated.permanentAddress,
        },
    })

    revalidatePath("/account")
    return { success: true }
}
