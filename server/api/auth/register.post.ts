import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

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

    if (!body.email || !validateEmail(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid email is required'
      })
    }

    if (!body.phone || !validatePhone(body.phone)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Valid phone number is required'
      })
    }

    if (!body.password || body.password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Password must be at least 6 characters'
      })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email.trim() },
          { phone: body.phone.trim() }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email or phone already exists'
      })
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(body.password, saltRounds)

    const userData = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      address: body.address ? body.address.trim() : null,
      password: hashedPassword,
      bonusPoints: 0,
      isAdmin: false
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        bonusPoints: true,
        isAdmin: true
      }
    })

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return {
      user,
      message: 'Registration successful'
    }

  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Registration failed'
    })
  }
})