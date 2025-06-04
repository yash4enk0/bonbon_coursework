export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth()
  
  if (!isLoggedIn.value) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please log in to access this page'
    })
  }
})