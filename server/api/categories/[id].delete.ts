import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid category ID'
      })
    }

    // Перевірити, чи є продукти в цій категорії
    const productsCount = await prisma.product.count({
      where: {
        categoryId: parseInt(id)
      }
    })

    if (productsCount > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Cannot delete category with existing products'
      })
    }

    await prisma.category.delete({
      where: {
        id: parseInt(id)
      }
    })

    return { message: 'Category deleted successfully' }
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete category'
    })
  }
})