const publicPaths = ['/login', '/signup']

export default defineNuxtRouteMiddleware(async (to) => {
  if (!publicPaths.includes(to.path)) {
    return
  }

  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const currentUser = await authStore.waitForAuth()

  if (currentUser) {
    const redirect = useCookie('redirect')
    const redirectPath = redirect.value || '/'
    redirect.value = null
    return navigateTo(redirectPath, { replace: true })
  }
})
