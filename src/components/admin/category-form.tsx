"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createCategory } from "@/app/actions/category-actions"
import { toast } from "sonner"
import { useState } from "react"

export function CategoryForm() {
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const res = await createCategory({ name, slug })
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Category created")
            setName("")
            setSlug("")
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
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Category"}
            </Button>
        </form>
    )
}
