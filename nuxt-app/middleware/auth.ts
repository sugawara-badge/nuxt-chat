export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  const authStore = useAuthStore()
  const currentUser = await authStore.waitForAuth()

  if (!currentUser) {
    const redirect = useCookie('redirect')
    redirect.value = to.fullPath
    // return navigateTo('/login', { replace: true })
    return navigateTo('/login');
  }
})
