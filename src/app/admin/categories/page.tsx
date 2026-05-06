import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/category-form"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { deleteCategory } from "@/app/actions/category-actions"
import { revalidatePath } from "next/cache"

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: { select: { products: true } },
            parent: true,
            children: true
        },
        orderBy: { name: 'asc' }
    })

    // Separate into top-level and children for better display if needed, 
    // but for now simplistic list with "Parent: Name" indicator is okay, 
    // or we can sort them.

    // Let's pass all categories to the form to be potential parents.
    // Ideally we filter to avoid circular references but basic list is fine for now.

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage your product categories.</p>
                </div>

                <div className="rounded-md border bg-white divide-y">
                    {categories.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">No categories found.</div>
                    )}
                    {categories.map((category) => (
                        <div key={category.id} className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold flex items-center gap-2">
                                    {category.name}
                                    {category.parentId && (
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                            Sub of: {category.parent?.name}
                                        </span>
                                    )}
                                </h3>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Slug: {category.slug} • {category._count.products} Products</p>
                                    {category.children.length > 0 && (
                                        <p className="text-xs">
                                            Subcategories: {category.children.map(c => c.name).join(", ")}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <form action={async () => {
                                "use server"
                                await deleteCategory(category.id)
                            }}>
                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-bold mb-4">Add Category</h2>
                    <CategoryForm categories={categories} />
                </div>
            </div>
        </div>
    )
}
