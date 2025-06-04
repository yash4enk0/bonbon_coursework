import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[-\s\(\)]/g, ''))
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.name || body.name.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name is required'
      })
    }

    if (!body.phone || body.phone.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Phone is required'
      })
    }

    if (!validatePhone(body.phone)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid phone number format'
      })
    }

    if (body.email && !validateEmail(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    if (!body.password || body.password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters'
      })
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(body.password, saltRounds)

    const userData = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email ? body.email.trim() : null,
      address: body.address ? body.address.trim() : null,
      photo: body.photo ? body.photo.trim() : null,
      bonusPoints: parseInt(body.bonusPoints) || 0,
      password: hashedPassword,
      isAdmin: Boolean(body.isAdmin)
    }

    const user = await prisma.user.create({
      data: userData,
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

    return user
  } catch (error: any) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0]
      throw createError({
        statusCode: 409,
        statusMessage: `User with this ${field} already exists`
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create user'
    })
  }
})