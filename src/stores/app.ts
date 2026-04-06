import { defineStore } from 'pinia'

import { fetchUiBundle } from '../services/authApi'
import type { UiBundleMenuItem } from 'rocket-alpha-ui/auth'
import type { NavigationItem } from '../types/navigation'
import type { UserRole } from '../types/auth'

interface AppState {
  initialized: boolean
  navigation: NavigationItem[]
  shellHeading: string
  shellDescription: string
  sessionLabel: string
}

const defaultNavigation: NavigationItem[] = [
  { label: '홈', caption: '사용자 서비스 홈', to: { name: 'home' }, requiresAuth: true, roles: ['customer'] },
  { label: '국내 뉴스', caption: '국내 시장 뉴스', to: { name: 'domestic-news' }, requiresAuth: true, roles: ['customer'] },
  { label: '해외 뉴스', caption: '글로벌 뉴스', to: { name: 'global-news' }, requiresAuth: true, roles: ['customer'] },
  { label: '주식 정보', caption: '국내 주식 관련 정보', to: { name: 'market-news' }, requiresAuth: true, roles: ['customer'] },
  { label: '알림 서비스', caption: 'SMS / Email 알림', to: { name: 'alerts' }, requiresAuth: true, roles: ['customer'] },
  { label: '패널 설정', caption: '노출/순서 설정', to: { name: 'preferences' }, requiresAuth: true, roles: ['customer'] },
  { label: 'Sign in', caption: '사용자 로그인', to: { name: 'login' } },
]

function flattenMenus(nodes: UiBundleMenuItem[]): NavigationItem[] {
  const results: NavigationItem[] = []
  for (const node of nodes) {
    results.push({
      label: node.label,
      caption: node.caption,
      to: { name: node.route_name || 'home' },
      requiresAuth: node.requires_auth,
      roles: node.role_scope as UserRole[],
    })
    if (node.children.length > 0) {
      results.push(...flattenMenus(node.children))
    }
  }
  return results
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    initialized: false,
    navigation: defaultNavigation,
    shellHeading: 'Customer news cockpit',
    shellDescription: '사용자 앱에서 국내 뉴스, 해외 뉴스, 국내 주식 관련 정보와 SMS/Email 알림 서비스를 한 화면 구조로 확장한다.',
    sessionLabel: 'Customer session',
  }),
  actions: {
    async initializeUi() {
      if (this.initialized) return
      try {
        const bundle = await fetchUiBundle('customer')
        this.navigation = flattenMenus(bundle.menus)
        this.shellHeading = bundle.shell.heading
        this.shellDescription = bundle.shell.description
        this.sessionLabel = bundle.shell.session_label
      } catch {
        // fallback to embedded defaults when bundle is unavailable (e.g. pre-login or transient backend issues)
      } finally {
        this.initialized = true
      }
    },
  },
})
