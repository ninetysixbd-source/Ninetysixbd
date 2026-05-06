
"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { RegisterForm } from "@/components/auth/register-form"

interface RegisterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onLoginClick: () => void
}

export function RegisterDialog({ open, onOpenChange, onLoginClick }: RegisterDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-normal">Create Account</DialogTitle>
                    <DialogDescription className="sr-only">Create a new account</DialogDescription>
                </DialogHeader>
                <RegisterForm
                    onSuccess={() => onOpenChange(false)}
                    onLoginClick={onLoginClick}
                />
            </DialogContent>
        </Dialog>
    )
}
