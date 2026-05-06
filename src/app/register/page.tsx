import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="flex bg-gray-50 min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-sm">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join us to start shopping
                    </p>
                </div>

                <RegisterForm />

                <div className="text-center">
                    <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
