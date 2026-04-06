<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppShell from '../components/layout/AppShell.vue'
import { fetchRoles } from '../services/authApi'
import type { UserRole } from '../types/auth'

const roles = ref<Array<{ code: UserRole; name: string; description: string }>>([])
const error = ref<string | null>(null)

const accessMatrix: Array<{ area: string; admin: string; operator: string; viewer: string }> = [
  { area: 'Dashboard', admin: 'full', operator: 'full', viewer: 'read' },
  { area: 'User management', admin: 'full', operator: 'none', viewer: 'none' },
  { area: 'Role policy', admin: 'full', operator: 'read', viewer: 'none' },
  { area: 'System settings', admin: 'full', operator: 'update', viewer: 'none' },
]

onMounted(async () => {
  try {
    roles.value = await fetchRoles()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '권한 목록을 불러오지 못했다.'
  }
})
</script>

<template>
  <AppShell>
    <section class="panel users-panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Role policy</p>
          <h3>권한 정의와 접근 매트릭스</h3>
        </div>
      </div>

      <p v-if="error" class="alert-banner auth-inline-error">{{ error }}</p>

      <div class="admin-layout">
        <article class="panel admin-subpanel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Defined roles</p>
              <h3>시스템 역할 목록</h3>
            </div>
          </div>

          <div class="role-card-grid">
            <article v-for="role in roles" :key="role.code" class="roadmap-item auth-provider-card">
              <span>{{ role.code }}</span>
              <small>{{ role.description }}</small>
            </article>
          </div>
        </article>

        <article class="panel admin-subpanel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Access matrix</p>
              <h3>메뉴별 허용 범위</h3>
            </div>
          </div>

          <div class="table-shell">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Admin</th>
                  <th>Operator</th>
                  <th>Viewer</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in accessMatrix" :key="item.area">
                  <td>{{ item.area }}</td>
                  <td>{{ item.admin }}</td>
                  <td>{{ item.operator }}</td>
                  <td>{{ item.viewer }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  </AppShell>
</template>
