"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { registerUser } from "@/app/actions/user-actions"
import { toast } from "sonner"
import Link from "next/link"

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
    onSuccess?: () => void
    onLoginClick?: () => void
}

export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        }
    })

    async function onSubmit(data: RegisterFormValues) {
        setIsLoading(true)
        try {
            const result = await registerUser(data)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Account created successfully. Please login.")
                form.reset()
                if (onSuccess) onSuccess()
                if (onLoginClick) onLoginClick()
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="" className="rounded-full" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="" className="rounded-full" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email address *</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="" className="rounded-full" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="" className="rounded-full" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="text-xs text-muted-foreground my-2">
                    Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <span className="underline cursor-pointer">privacy policy</span>.
                </div>

                <Button type="submit" disabled={isLoading} className="w-full rounded-full bg-black text-white hover:bg-black/90" size="lg">
                    {isLoading ? "Creating Account..." : "Register"}
                </Button>

                <div className="text-center text-sm mt-2">
                    {onLoginClick ? (
                        <span className="font-semibold">Already have an account? <button type="button" onClick={onLoginClick} className="underline decoration-1 underline-offset-4 font-semibold">Log in</button></span>
                    ) : (
                        <span className="font-semibold">Already have an account? <Link href="/login" className="underline decoration-1 underline-offset-4 font-semibold">Log in</Link></span>
                    )}

                </div>
            </form>
        </Form>
    )
}
