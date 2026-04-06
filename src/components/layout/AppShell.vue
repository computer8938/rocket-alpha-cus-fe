<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import SharedAppShell from 'rocket-alpha-ui/SharedAppShell.vue'

import { useAppStore } from '../../stores/app'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()

onMounted(() => {
  void appStore.initializeUi()
})

const visibleNavItems = computed(() =>
  appStore.navigation.filter((item) => {
    if (!item.requiresAuth) {
      return true
    }

    if (!authStore.isAuthenticated) {
      return false
    }

    if (!item.roles || item.roles.length === 0) {
      return true
    }

    return authStore.user !== null && item.roles.includes(authStore.user.role)
  }),
)

function isActiveRoute(itemTo: unknown): boolean {
  if (typeof itemTo !== 'object' || itemTo === null || !('name' in itemTo)) {
    return false
  }

  return route.name === itemTo.name
}

async function logout() {
  await authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <SharedAppShell
    :heading="appStore.shellHeading"
    :description="appStore.shellDescription"
    :session-label="appStore.sessionLabel"
    :role-label="authStore.roleLabel"
    :email="authStore.user?.email ?? null"
    :is-authenticated="authStore.isAuthenticated"
    :nav-items="visibleNavItems"
    @logout="logout"
  >
    <template #nav>
      <RouterLink
        v-for="item in visibleNavItems"
        :key="item.label"
        :to="item.to"
        class="roadmap-item"
        :class="{ 'roadmap-item--active': isActiveRoute(item.to) }"
      >
        <span>{{ item.label }}</span>
        <small>{{ item.caption }}</small>
      </RouterLink>
    </template>
    <slot />
  </SharedAppShell>
</template>
