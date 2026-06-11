import type { User } from '~/types/user'

export function useGreeting(user: User) {
  const greeting = computed(() => `こんにちは、${user.name}さん！`)

  return {
    greeting,
  }
}
