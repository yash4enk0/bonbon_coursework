export default defineEventHandler(async (event) => {
  try {
    setCookie(event, 'auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return {
      message: 'Logout successful'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Logout failed'
    })
  }
})