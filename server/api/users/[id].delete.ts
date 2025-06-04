import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid user ID'
      })
    }

    const ordersCount = await prisma.order.count({
      where: {
        userId: parseInt(id)
      }
    })

    const reviewsCount = await prisma.productReview.count({
      where: {
        userId: parseInt(id)
      }
    })

    if (ordersCount > 0 || reviewsCount > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete user with existing orders or reviews'
      })
    }

    await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    })

    return { message: 'User deleted successfully' }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user'
    })
  }
})