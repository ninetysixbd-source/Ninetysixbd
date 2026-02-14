"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, ProductFormValues } from "@/lib/validators/product-schema"
import { createProduct, updateProduct } from "@/app/actions/product-actions"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { SizeSelector } from "@/components/admin/size-selector"
import { ColorSelector } from "@/components/admin/color-selector"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"

interface ProductFormProps {
    categories: { id: string; name: string }[]
    initialData?: ProductFormValues & { id: string }
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any,
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description,
            price: initialData.price,
            salePrice: initialData.salePrice || null,
            discountPercentage: initialData.discountPercentage || null,
            stock: initialData.stock,
            inStock: initialData.inStock ?? true,
            status: initialData.status,
            categoryId: initialData.categoryId,
            images: initialData.images || [],
            sizes: initialData.sizes as any || { available: [], unavailable: [] },
            colors: initialData.colors as any || { available: [], unavailable: [] },
        } : {
            name: "",
            slug: "",
            description: "",
            price: 0,
            salePrice: null,
            discountPercentage: null,
            stock: 0,
            inStock: true,
            status: "PUBLISHED",
            categoryId: "",
            images: [],
            sizes: { available: [], unavailable: [] },
            colors: { available: [], unavailable: [] },
        },
    })

    // Auto-generate slug from name only in create mode
    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (initialData) return
        const name = e.target.value
        form.setValue("name", name)
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
        form.setValue("slug", slug)
    }

    // Auto-calculate sale price when discount percentage changes
    function handleDiscountChange(e: React.ChangeEvent<HTMLInputElement>) {
        const discount = parseFloat(e.target.value || "0")
        const price = form.getValues("price")

        if (discount > 0 && discount <= 100 && price > 0) {
            const salePrice = price * (1 - discount / 100)
            form.setValue("salePrice", parseFloat(salePrice.toFixed(2)))
        } else {
            form.setValue("salePrice", null)
        }

        form.setValue("discountPercentage", discount || null)
    }

    function onSubmit(data: ProductFormValues) {
        startTransition(async () => {
            if (initialData) {
                const result = await updateProduct(initialData.id, data)
                if (result?.error) {
                    toast.error(result.error)
                }
            } else {
                const result = await createProduct(data)
                if (result?.error) {
                    toast.error(result.error)
                }
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Premium Cotton T-Shirt" {...field} onChange={handleNameChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Slug (URL Friendly)</FormLabel>
                            <FormControl>
                                <Input placeholder="premium-cotton-t-shirt" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Product details..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price (Tk)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            // Auto-calculate sale price if discount exists
                                            const price = parseFloat(e.target.value || "0")
                                            const discount = form.getValues("discountPercentage")
                                            if (discount && discount > 0 && price > 0) {
                                                const salePrice = price * (1 - discount / 100)
                                                form.setValue("salePrice", parseFloat(salePrice.toFixed(2)))
                                            }
                                        }}
                                    />

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="stock"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" min="0" step="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inStock"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>In Stock</FormLabel>
                                        <div className="text-[0.8rem] text-muted-foreground">
                                            Mark as available for purchase
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="discountPercentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount % (Optional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="1"
                                            placeholder="e.g., 20 for 20% off"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={handleDiscountChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="salePrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sale Price (Tk)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Auto-calculated from discount"
                                            {...field}
                                            value={field.value ?? ""}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Sizes (Optional)</FormLabel>
                                <FormControl>
                                    <SizeSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Colors (Optional)</FormLabel>
                                <FormControl>
                                    <ColorSelector
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Images</FormLabel>
                                <FormControl>
                                    <FileUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : initialData ? "Update Product" : "Create Product"}
                    </Button>
            </form>
        </Form>
    )
}
