"use client"

import { Switch } from "@/components/ui/switch"
import { useTransition } from "react"
import { toggleSpecialDeal } from "@/app/actions/product-actions"
import { toast } from "sonner"

interface SpecialDealToggleProps {
    productId: string
    initialValue: boolean
}

export function SpecialDealToggle({ productId, initialValue }: SpecialDealToggleProps) {
    const [isPending, startTransition] = useTransition()

    return (
        <Switch
            checked={initialValue}
            disabled={isPending}
            onCheckedChange={(checked) => {
                startTransition(async () => {
                    const res = await toggleSpecialDeal(productId, checked)
                    if (res?.error) {
                        toast.error(res.error)
                    } else {
                        toast.success(`Special deal ${checked ? 'enabled' : 'disabled'}`)
                    }
                })
            }}
        />
    )
}
