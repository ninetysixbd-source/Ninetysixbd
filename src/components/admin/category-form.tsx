"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory } from "@/app/actions/category-actions"
import { toast } from "sonner"
import { useState } from "react"

// ... imports
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function CategoryForm({ categories }: { categories: { id: string, name: string }[] }) {
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [parentId, setParentId] = useState<string>("none")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await createCategory({
            name,
            slug,
            parentId: parentId === "none" ? undefined : parentId
        })
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Category created")
            setName("")
            setSlug("")
            setParentId("none")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Name</Label>
                <Input
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setSlug(e.target.value.toLowerCase().replace(/ /g, '-'))
                    }}
                    placeholder="e.g. Winter Collection"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. winter-collection"
                    required
                />
            </div>
            <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select value={parentId} onValueChange={setParentId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">None (Top Level)</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Category"}
            </Button>
        </form>
    )
}
