import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'asc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        photo: true,
        bonusPoints: true,
        isAdmin: true
      }
    })
    return users
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users'
    })
  }
})