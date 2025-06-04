export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, isAdmin } = useAuth()
  
  if (!isLoggedIn.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please log in to access this page'
    })
  }
  
  if (!isAdmin.value) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
})