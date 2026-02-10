import { ProductForm } from "@/components/admin/product-form"
import { getCategories } from "@/app/actions/product-actions"

export default async function NewProductPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                <p className="text-muted-foreground">Add a new product to your store.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
                <ProductForm categories={categories} />
            </div>
        </div>
    )
}
