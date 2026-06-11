import type { User } from '~/types/user'

export default defineEventHandler((): User => {
  return {
    id: 1,
    name: 'API テストユーザー',
    email: 'api@example.com',
  }
})
