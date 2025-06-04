import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id || isNaN(parseInt(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid product ID'
      })
    }

    if (!body.name || body.name.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Product name is required'
      })
    }

    if (!body.article || body.article.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article number is required'
      })
    }

    if (!body.price || isNaN(parseFloat(body.price)) || parseFloat(body.price) <= 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid price is required'
      })
    }

    if (!body.categoryId || isNaN(parseInt(body.categoryId))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid category is required'
      })
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(body.categoryId) }
    })

    if (!category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Selected category does not exist'
      })
    }

    const updateData = {
      name: body.name.trim(),
      article: body.article.trim().toUpperCase(),
      description: body.description ? body.description.trim() : null,
      price: parseFloat(body.price),
      availability: Boolean(body.availability !== false),
      categoryId: parseInt(body.categoryId)
    }

    const product = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        photos: {
          select: {
            id: true,
            filePath: true,
            caption: true
          }
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true
          }
        }
      }
    })

    const formattedProduct = {
      id: product.id,
      name: product.name,
      article: product.article,
      description: product.description,
      price: parseFloat(product.price.toString()),
      availability: product.availability,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      photos: product.photos,
      orderCount: product._count.orderItems,
      reviewCount: product._count.reviews
    }

    return formattedProduct
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Product with this article number already exists'
      })
    }

    if (error.code === 'P2003') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid category selected'
      })
    }

    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product'
    })
  }
})