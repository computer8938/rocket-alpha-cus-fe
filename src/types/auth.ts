export type UserRole = 'admin' | 'operator' | 'viewer' | 'customer'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: 'active' | 'disabled' | 'invited'
  last_login_at?: string | null
  created_at?: string | null
}

export interface AuthSession {
  session_id: string
  expires_at: string
}

export interface AuthProvider {
  key: 'local' | 'google' | 'kakao'
  enabled: boolean
  display_name: string
  status?: string
}
