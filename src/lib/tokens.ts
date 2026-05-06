import { prisma } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

// Ensure uuid is installed or use crypto
// We will use crypto for native support if uuid is not desired, but uuid is standard.
// Let's use standard Web Crypto API if available or just install uuid.
// Actually, simple random string is fine for now but uuid is better.
// I'll stick to uuid but I need to install it.
// simpler: crypto.randomUUID() (Node 14.17+) 

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID()

    // Expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await prisma.passwordResetToken.findFirst({
        where: { email }
    })

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        })
        return passwordResetToken
    } catch {
        return null
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email }
        })
        return passwordResetToken
    } catch {
        return null
    }
}
