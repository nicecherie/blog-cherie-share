export const AUTH_CONFIG = {
  ALLOWED_EMAILS: ['huangcherie@163.com']
}
interface User {
  email?: string
  user_metadata?: {
    user_name?: string
    preferred_username?: string
  }
}
export function isAdmin(user: User | null): boolean {
  if (!user) return false
  if (user.email && AUTH_CONFIG.ALLOWED_EMAILS.includes(user.email)) return true
  return false
}
