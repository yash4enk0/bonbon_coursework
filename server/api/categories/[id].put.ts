import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id || isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid category ID'
      })
    }

    if (!body.name || body.name.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category name is required'
      })
    }

    const category = await prisma.category.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: body.name.trim()
      }
    })

    return category
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Category not found'
      })
    }

    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Category with this name already exists'
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update category'
    })
  }
})