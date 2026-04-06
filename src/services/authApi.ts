import { createAuthApiClient } from 'rocket-alpha-ui/auth'

import type { UserRole } from '../types/auth'

export const {
  createAuthUser,
  createUiMenu,
  createUiTerm,
  fetchAdminPanelConfig,
  fetchAuthProviders,
  fetchCurrentSession,
  fetchPanelCatalog,
  fetchPanelConfig,
  fetchUiBundle,
  fetchRoles,
  fetchUsers,
  listUiMenus,
  listUiTerms,
  loginWithPassword,
  logoutCurrentSession,
  deleteUiMenu,
  deleteUiTerm,
  saveAdminPanelConfig,
  savePanelPreferences,
  updateUiMenu,
  updateUiTerm,
  updateAuthUser,
} = createAuthApiClient<UserRole>(import.meta.env.VITE_AUTH_API_BASE ?? '/api/auth')
