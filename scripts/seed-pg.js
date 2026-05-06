const { Client } = require('pg')
require('dotenv').config()

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

async function main() {
    await client.connect()

    const categories = [
        { name: "Men", slug: "men", id: "cat_men" },
        { name: "Women", slug: "women", id: "cat_women" },
        { name: "Accessories", slug: "accessories", id: "cat_acc" },
        { name: "Electronics", slug: "electronics", id: "cat_elec" },
    ]

    for (const cat of categories) {
        const query = `
      INSERT INTO "Category" (id, name, slug)
      VALUES ($1, $2, $3)
      ON CONFLICT (slug) DO NOTHING;
    `
        await client.query(query, [cat.id, cat.name, cat.slug])
    }

    console.log("Categories seeded via pg!")
    await client.end()
}

main().catch(console.error)
