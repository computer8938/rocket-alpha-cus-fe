<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import AppShell from '../components/layout/AppShell.vue'
import { createAuthUser, fetchUsers, updateAuthUser } from '../services/authApi'
import type { AuthUser, UserRole } from '../types/auth'
import { formatDateTime } from '../utils/format'

const users = ref<AuthUser[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const editingUserId = ref<string | null>(null)

const createForm = reactive({
  email: '',
  name: '',
  role: 'viewer' as UserRole,
  status: 'active' as 'active' | 'disabled' | 'invited',
  password: '',
})

const editForm = reactive({
  name: '',
  role: 'viewer' as UserRole,
  status: 'active' as 'active' | 'disabled' | 'invited',
  password: '',
})

async function loadUsers() {
  loading.value = true
  error.value = null
  try {
    users.value = await fetchUsers()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '사용자 목록을 불러오지 못했다.'
  } finally {
    loading.value = false
  }
}

async function submitCreate() {
  error.value = null
  try {
    await createAuthUser({
      email: createForm.email,
      name: createForm.name,
      role: createForm.role,
      status: createForm.status,
      password: createForm.password || undefined,
    })
    createForm.email = ''
    createForm.name = ''
    createForm.role = 'viewer'
    createForm.status = 'active'
    createForm.password = ''
    await loadUsers()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '사용자를 생성하지 못했다.'
  }
}

function startEdit(user: AuthUser) {
  editingUserId.value = user.id
  editForm.name = user.name
  editForm.role = user.role
  editForm.status = user.status
  editForm.password = ''
}

async function submitEdit(userId: string) {
  error.value = null
  try {
    await updateAuthUser(userId, {
      name: editForm.name,
      role: editForm.role,
      status: editForm.status,
      password: editForm.password || undefined,
    })
    editingUserId.value = null
    editForm.password = ''
    await loadUsers()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '사용자를 수정하지 못했다.'
  }
}

onMounted(async () => {
  await loadUsers()
})
</script>

<template>
  <AppShell>
    <section class="panel users-panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">User management</p>
          <h3>사용자 및 역할 운영</h3>
        </div>
      </div>

      <p v-if="error" class="alert-banner auth-inline-error">{{ error }}</p>

      <div class="admin-layout">
        <article class="panel admin-subpanel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Create user</p>
              <h3>새 운영 계정 추가</h3>
            </div>
          </div>

          <form class="auth-form" @submit.prevent="submitCreate">
            <label class="auth-field">
              <span>Email</span>
              <input v-model="createForm.email" type="email" required />
            </label>
            <label class="auth-field">
              <span>Name</span>
              <input v-model="createForm.name" type="text" required />
            </label>
            <label class="auth-field">
              <span>Role</span>
              <select v-model="createForm.role">
                <option value="admin">admin</option>
                <option value="operator">operator</option>
                <option value="viewer">viewer</option>
              </select>
            </label>
            <label class="auth-field">
              <span>Status</span>
              <select v-model="createForm.status">
                <option value="active">active</option>
                <option value="disabled">disabled</option>
                <option value="invited">invited</option>
              </select>
            </label>
            <label class="auth-field">
              <span>Temporary password</span>
              <input v-model="createForm.password" type="password" minlength="8" />
            </label>
            <button class="refresh-button auth-submit" type="submit">사용자 생성</button>
          </form>
        </article>

        <article class="panel admin-subpanel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Users</p>
              <h3>현재 계정 목록</h3>
            </div>
          </div>

          <div v-if="loading" class="panel-empty">사용자 목록을 불러오는 중이다.</div>
          <div v-else class="table-shell">
            <table class="metrics-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last login</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>{{ user.status }}</td>
                  <td>{{ formatDateTime(user.last_login_at) }}</td>
                  <td>
                    <button class="identity-card__logout" @click="startEdit(user)">편집</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <article v-if="editingUserId" class="panel admin-subpanel edit-panel">
        <div class="panel__header">
          <div>
            <p class="eyebrow">Edit user</p>
            <h3>사용자 수정</h3>
          </div>
        </div>

        <form class="auth-form" @submit.prevent="submitEdit(editingUserId)">
          <label class="auth-field">
            <span>Name</span>
            <input v-model="editForm.name" type="text" required />
          </label>
          <label class="auth-field">
            <span>Role</span>
            <select v-model="editForm.role">
              <option value="admin">admin</option>
              <option value="operator">operator</option>
              <option value="viewer">viewer</option>
            </select>
          </label>
          <label class="auth-field">
            <span>Status</span>
            <select v-model="editForm.status">
              <option value="active">active</option>
              <option value="disabled">disabled</option>
              <option value="invited">invited</option>
            </select>
          </label>
          <label class="auth-field">
            <span>Reset password</span>
            <input v-model="editForm.password" type="password" minlength="8" />
          </label>
          <div class="auth-actions">
            <button class="refresh-button auth-submit" type="submit">저장</button>
            <button class="identity-card__logout" type="button" @click="editingUserId = null">취소</button>
          </div>
        </form>
      </article>
    </section>
  </AppShell>
</template>
