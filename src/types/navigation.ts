import type { RouteLocationRaw } from 'vue-router'

import type { UserRole } from './auth'

export interface NavigationItem {
  label: string
  caption: string
  to: RouteLocationRaw
  requiresAuth?: boolean
  roles?: UserRole[]
}
