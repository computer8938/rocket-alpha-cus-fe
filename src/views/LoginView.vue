<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppShell from '../components/layout/AppShell.vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const form = reactive({
  email: 'admin@rocket-alpha.local',
  password: 'ChangeMe123!',
})

const enabledProviders = computed(() => authStore.providers.filter((provider) => provider.enabled))
const enabledSocialProviders = computed(() => enabledProviders.value.filter((provider) => provider.key !== 'local'))
const plannedProviders = computed(() => authStore.providers.filter((provider) => !provider.enabled && provider.key !== 'local'))

function getOauthStartUrl(providerKey: string) {
  return `/api/auth/oauth/${providerKey}/start?app=customer&redirect_to=/`
}

async function submit() {
  authStore.clearError()
  try {
    await authStore.login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch {
    // error is already stored in the auth store
  }
}
</script>

<template>
  <AppShell>
    <section class="panel auth-panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Customer authentication</p>
          <h3>사용자 포털 로그인</h3>
        </div>
      </div>

      <p class="sidebar-copy auth-copy">
        사용자 포털은 로컬 계정으로 즉시 로그인 가능하며, 이후 Google/Kakao 기반 사용자 인증으로 확장된다.
      </p>

      <form class="auth-form" @submit.prevent="submit">
        <label class="auth-field">
          <span>Email</span>
          <input v-model="form.email" type="email" autocomplete="username" />
        </label>

        <label class="auth-field">
          <span>Password</span>
          <input v-model="form.password" type="password" autocomplete="current-password" />
        </label>

        <p v-if="authStore.error" class="alert-banner auth-inline-error">{{ authStore.error }}</p>

        <button class="refresh-button auth-submit" :disabled="authStore.loading" type="submit">
          {{ authStore.loading ? '로그인 중…' : '로그인' }}
        </button>
      </form>

      <div class="auth-provider-grid">
        <article v-if="enabledSocialProviders.length > 0" class="roadmap-item auth-provider-card auth-provider-card--action">
          <span>소셜 로그인</span>
          <div class="auth-actions">
            <a v-for="provider in enabledSocialProviders" :key="provider.key" class="identity-card__logout auth-oauth-link" :href="getOauthStartUrl(provider.key)">
              {{ provider.display_name }} 로그인
            </a>
          </div>
        </article>
        <article class="roadmap-item auth-provider-card">
          <span>활성 인증 수단</span>
          <small v-if="enabledProviders.length > 0">{{ enabledProviders.map((provider) => provider.display_name).join(', ') }}</small>
          <small v-else>현재는 사용 가능한 인증 수단이 없다.</small>
        </article>
        <article class="roadmap-item auth-provider-card">
          <span>준비 중인 소셜 로그인</span>
          <small>{{ plannedProviders.map((provider) => provider.display_name).join(', ') || '없음' }}</small>
        </article>
      </div>
    </section>
  </AppShell>
</template>
