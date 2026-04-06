import { defineStore } from 'pinia'

import { fetchAuthProviders, fetchCurrentSession, loginWithPassword, logoutCurrentSession } from '../services/authApi'
import type { AuthProvider, AuthUser } from '../types/auth'

interface AuthState {
  initialized: boolean
  loading: boolean
  isAuthenticated: boolean
  user: AuthUser | null
  error: string | null
  providers: AuthProvider[]
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    initialized: false,
    loading: false,
    isAuthenticated: false,
    user: null,
    error: null,
    providers: [],
  }),
  getters: {
    role: (state) => state.user?.role ?? 'viewer',
    roleLabel: (state) => {
      const role = state.user?.role
      if (role === 'admin') return 'Administrator'
      if (role === 'operator') return 'Operator'
      if (role === 'customer') return 'Customer'
      return 'Viewer'
    },
  },
  actions: {
    async initialize() {
      if (this.initialized) {
        return
      }

      this.loading = true
      try {
        this.providers = await fetchAuthProviders()
      } catch {
        this.providers = []
      }

      try {
        const session = await fetchCurrentSession()
        this.user = session.user
        this.isAuthenticated = session.authenticated && session.user !== null
        this.error = null
      } catch {
        this.user = null
        this.isAuthenticated = false
      } finally {
        this.initialized = true
        this.loading = false
      }
    },
    async login(email: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const response = await loginWithPassword(email, password)
        this.user = response.user
        this.isAuthenticated = true
        this.initialized = true
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        this.error = error instanceof Error ? error.message : '로그인에 실패했다.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      try {
        await logoutCurrentSession()
      } finally {
        this.user = null
        this.isAuthenticated = false
        this.initialized = true
        this.loading = false
      }
    },
    setAuthenticatedUser(user: AuthUser | null) {
      this.user = user
      this.isAuthenticated = user !== null
      this.initialized = true
    },
    clearError() {
      this.error = null
    },
    async refreshSession() {
      try {
        const session = await fetchCurrentSession()
        this.user = session.user
        this.isAuthenticated = session.authenticated && session.user !== null
      } catch {
        this.user = null
        this.isAuthenticated = false
      }
    },
  },
})
