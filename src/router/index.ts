import { createRouter, createWebHistory } from 'vue-router'

import { pinia } from '../plugins/pinia'
import { useAuthStore } from '../stores/auth'
import CustomerHomeView from '../views/CustomerHomeView.vue'
import LoginView from '../views/LoginView.vue'
import PanelPreferencesView from '../views/PanelPreferencesView.vue'
import PlaceholderView from '../views/PlaceholderView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CustomerHomeView,
      meta: {
        title: 'Rocket Alpha Customer',
        requiresAuth: true,
        roles: ['customer'],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Rocket Alpha Sign In',
      },
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: PlaceholderView,
      props: {
        title: '접근 권한 없음',
        description: '현재 세션은 사용자 포털에 접근할 권한이 없다. 고객 계정으로 다시 로그인해야 한다.',
      },
      meta: {
        title: 'Rocket Alpha Customer Access Denied',
      },
    },
    {
      path: '/domestic-news',
      name: 'domestic-news',
      component: PlaceholderView,
      props: {
        title: '국내 뉴스',
        description: '국내 주요 뉴스와 관심 종목 중심의 뉴스 피드를 사용자용으로 제공한다.',
      },
      meta: {
        title: 'Rocket Alpha Domestic News',
        requiresAuth: true,
        roles: ['customer'],
      },
    },
    {
      path: '/global-news',
      name: 'global-news',
      component: PlaceholderView,
      props: {
        title: '해외 뉴스',
        description: '해외 시장과 기업 관련 뉴스를 사용자 앱에서 함께 제공한다.',
      },
      meta: {
        title: 'Rocket Alpha Global News',
        requiresAuth: true,
        roles: ['customer'],
      },
    },
    {
      path: '/market-news',
      name: 'market-news',
      component: PlaceholderView,
      props: {
        title: '국내 주식 정보',
        description: '국내 주식 관련 뉴스, 요약 정보, 관심 종목 탐색 UI를 사용자용으로 제공한다.',
      },
      meta: {
        title: 'Rocket Alpha Market News',
        requiresAuth: true,
        roles: ['customer'],
      },
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: PanelPreferencesView,
      meta: {
        title: 'Rocket Alpha Preferences',
        requiresAuth: true,
        roles: ['customer'],
      },
    },
    {
      path: '/alerts',
      name: 'alerts',
      component: PlaceholderView,
      props: {
        title: '알림 서비스',
        description: 'SMS와 Email 알림 서비스를 설정하고 구독 상태를 관리한다.',
      },
      meta: {
        title: 'Rocket Alpha Alerts',
        requiresAuth: true,
        roles: ['customer'],
      },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)

  const evaluateRoute = () => {
    const requiresAuth = to.meta.requiresAuth === true
    const allowedRoles = Array.isArray(to.meta.roles) ? to.meta.roles : []
    const currentRole = authStore.user?.role
    const isAuthorized =
      !requiresAuth ||
      allowedRoles.length === 0 ||
      (currentRole !== undefined && allowedRoles.includes(currentRole))

    if (requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (requiresAuth && !isAuthorized && to.name !== 'access-denied') {
      return { name: 'access-denied' }
    }

    if (to.name === 'login' && authStore.isAuthenticated) {
      return isAuthorized ? { name: 'home' } : { name: 'access-denied' }
    }

    return true
  }

  if (!authStore.initialized) {
    return authStore.initialize().then(() => evaluateRoute())
  }

  return evaluateRoute()
})

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : 'Rocket Alpha'
  document.title = title
})
