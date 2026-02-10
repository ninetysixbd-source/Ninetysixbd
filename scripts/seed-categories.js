const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    const categories = [
        { name: "Men", slug: "men" },
        { name: "Women", slug: "women" },
        { name: "Accessories", slug: "accessories" },
        { name: "Electronics", slug: "electronics" },
    ]

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        })
    }

    console.log("Categories seeded!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
