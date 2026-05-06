
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { LoginForm } from "@/components/auth/login-form"

interface LoginDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onRegisterClick: () => void
}

export function LoginDialog({ open, onOpenChange, onRegisterClick }: LoginDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-normal">Login</DialogTitle>
                    </div>
                    <DialogDescription className="sr-only">Sign in to your account</DialogDescription>
                </DialogHeader>
                <LoginForm
                    onSuccess={() => onOpenChange(false)}
                    onRegisterClick={onRegisterClick}
                    redirect={true}
                />
            </DialogContent>
        </Dialog>
    )
}
