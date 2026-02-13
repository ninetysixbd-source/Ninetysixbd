import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    debug: process.env.NODE_ENV === "development" || true, // Enable debug logs on Vercel temporarily
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        Google({
            checks: ["state"],
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const email = credentials.email as string
                const password = credentials.password as string

                const user = await prisma.user.findUnique({
                    where: { email },
                })

                if (!user || !user.password) {
                    return null
                }

                const isValid = await bcrypt.compare(password, user.password)

                if (!isValid) {
                    return null
                }

                return user
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as any
            }
            return session
        },
        async jwt({ token, user, trigger }) {
            // On sign in, fetch the role from database
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true }
                })
                token.role = dbUser?.role || "USER"
            }
            return token
        }
    },
})
