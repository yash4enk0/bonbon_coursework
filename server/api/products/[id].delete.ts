import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid product ID'
      })
    }

    const orderItemsCount = await prisma.orderItem.count({
      where: {
        productId: parseInt(id)
      }
    })

    const reviewsCount = await prisma.productReview.count({
      where: {
        productId: parseInt(id)
      }
    })

    if (orderItemsCount > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete product that has been ordered'
      })
    }

    if (reviewsCount > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete product that has reviews'
      })
    }

    await prisma.product.delete({
      where: {
        id: parseInt(id)
      }
    })

    return { message: 'Product deleted successfully' }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product'
    })
  }
})