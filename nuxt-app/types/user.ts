export interface User {
  id: number
  name: string
  email: string
}

export type UserRole = 'admin' | 'member' | 'guest'

export interface UserWithRole extends User {
  role: UserRole
}
