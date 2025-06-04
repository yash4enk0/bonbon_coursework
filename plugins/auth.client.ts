export default defineNuxtPlugin(async () => {
  try {
    await $fetch('/api/auth/me')
  } catch (error) {
  }
})