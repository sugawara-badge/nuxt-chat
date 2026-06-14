export default defineNuxtPlugin({
  name: 'auth',
  dependsOn: ['firebase'],
  async setup() {
    const authStore = useAuthStore()
    await authStore.waitForAuth()
  },
})
