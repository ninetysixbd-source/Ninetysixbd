
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    // List all users to find the target
    const users = await prisma.user.findMany()
    console.log("Found users:", users)

    if (users.length === 0) {
        console.log("No users found.")
        return
    }

    const targetUser = users[0] // Just grab the first user for now, or filter by email if known

    console.log(` promoting user ${targetUser.email} to ADMIN...`)

    const updatedUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: { role: 'ADMIN' },
    })

    console.log("User updated:", updatedUser)
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
