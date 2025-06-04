import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'asc'
      },
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

    // Format the response to include category name and counts
    const formattedProducts = products.map(product => ({
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
    }))

    return formattedProducts
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})