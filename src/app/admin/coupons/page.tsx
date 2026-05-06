"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createCoupon, deleteCoupon, getCoupons } from "@/app/actions/admin-coupon-actions"
import { formatPrice } from "@/lib/utils"
import { Trash, Plus } from "lucide-react"

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [formData, setFormData] = useState({
        code: "",
        type: "PERCENTAGE",
        amount: "",
        minOrderAmount: "",
        usageLimit: "",
        expiresAt: ""
    })

    useEffect(() => {
        loadCoupons()
    }, [])

    const loadCoupons = async () => {
        const result = await getCoupons()
        if (result.coupons) {
            setCoupons(result.coupons)
        }
        setIsLoading(false)
    }

    const handleCreate = async () => {
        if (!formData.code || !formData.amount) {
            toast.error("Code and Amount are required")
            return
        }

        const result = await createCoupon({
            ...formData,
            amount: parseFloat(formData.amount),
            minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
            usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
        })

        if (result.success) {
            toast.success("Coupon created")
            setIsCreateOpen(false)
            setFormData({
                code: "",
                type: "PERCENTAGE",
                amount: "",
                minOrderAmount: "",
                usageLimit: "",
                expiresAt: ""
            })
            loadCoupons()
        } else {
            toast.error(result.error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this coupon?")) {
            const result = await deleteCoupon(id)
            if (result.success) {
                toast.success("Coupon deleted")
                loadCoupons()
            } else {
                toast.error(result.error)
            }
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Coupons</h1>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Create Coupon</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Coupon</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Coupon Code</Label>
                                <Input
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. SUMMER20"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={val => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                        <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder={formData.type === "PERCENTAGE" ? "20" : "100"}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Min Order Amount (Optional)</Label>
                                <Input
                                    type="number"
                                    value={formData.minOrderAmount}
                                    onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Usage Limit (Optional)</Label>
                                <Input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Expires At (Optional)</Label>
                                <Input
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleCreate}>Create Coupon</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Expires</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {coupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                                <TableCell className="font-medium">{coupon.code}</TableCell>
                                <TableCell>{coupon.type}</TableCell>
                                <TableCell>
                                    {coupon.type === "PERCENTAGE"
                                        ? `${coupon.amount}%`
                                        : formatPrice(coupon.amount)}
                                </TableCell>
                                <TableCell>{coupon.usedCount} / {coupon.usageLimit || "∞"}</TableCell>
                                <TableCell>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                                        <Trash className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {coupons.length === 0 && !isLoading && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No coupons found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
