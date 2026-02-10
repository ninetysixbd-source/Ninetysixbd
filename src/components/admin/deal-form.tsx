"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOffer } from "@/app/actions/deal-actions"
import { toast } from "sonner"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { FileUpload } from "@/components/file-upload"

export function DealForm() {
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>([])

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            backgroundColor: formData.get("backgroundColor") as string,
            image: images[0] || "", // Use uploaded image
            expiresAt: formData.get("expiresAt") as string,
        }

        const res = await createOffer(data)
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Deal created")
            setImages([]) // Reset images
            // Ideally reset form here
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" placeholder="Summer Sale" required />
            </div>
            <div className="space-y-2">
                <Label>Description</Label>
                <Input name="description" placeholder="Up to 50% off" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Background Color</Label>
                    <Select name="backgroundColor" defaultValue="bg-orange-100">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="bg-orange-100">Orange</SelectItem>
                            <SelectItem value="bg-blue-100">Blue</SelectItem>
                            <SelectItem value="bg-purple-100">Purple</SelectItem>
                            <SelectItem value="bg-green-100">Green</SelectItem>
                            <SelectItem value="bg-red-100">Red</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Expires At (Optional)</Label>
                    <Input name="expiresAt" type="date" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Deal Image (Optional)</Label>
                <FileUpload value={images} onChange={setImages} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Deal"}
            </Button>
        </form>
    )
}
