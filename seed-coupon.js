
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    const coupon = await prisma.coupon.upsert({
        where: { code: 'SAVE10' },
        update: {},
        create: {
            code: 'SAVE10',
            type: 'PERCENTAGE',
            amount: 10.00,
            isActive: true,
            minOrderAmount: 0,
            usageLimit: 100,
            // expiresAt: new Date('2030-12-31') 
        },
    })
    console.log('Created coupon:', coupon)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
