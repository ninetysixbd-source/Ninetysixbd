import { SerializableProduct } from "@/lib/types"

interface ProductTabsProps {
    product: SerializableProduct
}

export function ProductTabs({ product }: ProductTabsProps) {
    return (
        <div className="mt-12 border-t pt-8">
            <h3 className="text-base font-semibold mb-4 text-foreground">Description</h3>
            <div
                className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: product.description }}
            />
        </div>
    )
}
