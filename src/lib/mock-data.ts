export interface MockProduct {
    id: string
    name: string
    slug: string
    description: string
    price: number
    salePrice: number | null
    stock: number
    categoryId: string
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK"
    images: string[]
    category: {
        id: string
        name: string
        slug: string
    }
}

export const MOCK_PRODUCTS: MockProduct[] = [
    {
        id: "1",
        name: "Premium Cotton T-Shirt",
        slug: "premium-cotton-t-shirt",
        description: "A high-quality cotton t-shirt perfect for everyday wear. Breathable fabric and comfortable fit.",
        price: 1500,
        salePrice: 1200,
        stock: 50,
        categoryId: "men",
        status: "PUBLISHED",
        images: [],
        category: { id: "cat_1", name: "Men", slug: "men" }
    },
    {
        id: "2",
        name: "Slim Fit Jeans",
        slug: "slim-fit-jeans",
        description: "Modern slim fit jeans made with durable denim. Stylish and versatile for any occasion.",
        price: 2500,
        salePrice: null,
        stock: 30,
        categoryId: "men",
        status: "PUBLISHED",
        images: [],
        category: { id: "cat_1", name: "Men", slug: "men" }
    },
    {
        id: "3",
        name: "Leather Wallet",
        slug: "leather-wallet",
        description: "Genuine leather wallet with multiple card slots and cash compartment. Sleek design.",
        price: 1000,
        salePrice: null,
        stock: 0,
        categoryId: "accessories",
        status: "OUT_OF_STOCK", // Mapped to ARCHIVED or handled via stock check
        images: [],
        category: { id: "cat_3", name: "Accessories", slug: "accessories" }
    },
    {
        id: "4",
        name: "Summer Floral Dress",
        slug: "summer-floral-dress",
        description: "Lightweight floral dress perfect for summer outings. Elegant design and comfortable wear.",
        price: 3500,
        salePrice: 3000,
        stock: 15,
        categoryId: "women",
        status: "PUBLISHED",
        images: [],
        category: { id: "cat_2", name: "Women", slug: "women" }
    }
]

export const MOCK_CATEGORIES = [
    { id: "cat_1", name: "Men", slug: "men" },
    { id: "cat_2", name: "Women", slug: "women" },
    { id: "cat_3", name: "Accessories", slug: "accessories" },
]
