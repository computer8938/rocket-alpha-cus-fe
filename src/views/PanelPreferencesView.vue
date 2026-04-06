<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppShell from '../components/layout/AppShell.vue'
import { fetchPanelConfig, savePanelPreferences } from '../services/authApi'
import type { PanelConfigItem } from 'rocket-alpha-ui/panels'

const panels = ref<PanelConfigItem[]>([])
const error = ref<string | null>(null)

async function load() {
  try {
    error.value = null
    panels.value = await fetchPanelConfig('customer')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '패널 설정을 불러오지 못했다.'
  }
}

function move(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= panels.value.length) return
  const next = [...panels.value]
  ;[next[index], next[target]] = [next[target], next[index]]
  next.forEach((panel, idx) => {
    panel.user_order = idx + 1
  })
  panels.value = next
}

async function save() {
  try {
    error.value = null
    panels.value = await savePanelPreferences(
      'customer',
      panels.value.map((panel, index) => ({
        panel_key: panel.panel_key,
        is_visible: panel.user_visible ?? panel.effective_visible,
        display_order: panel.user_order ?? index + 1,
      })),
    )
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '패널 설정을 저장하지 못했다.'
  }
}

onMounted(load)
</script>

<template>
  <AppShell>
    <section class="panel users-panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Panel preferences</p>
          <h3>사용자 패널 노출/순서 설정</h3>
        </div>
      </div>
      <p v-if="error" class="alert-banner auth-inline-error">{{ error }}</p>
      <div class="list-panel">
        <div v-for="(panel, index) in panels" :key="panel.panel_key" class="roadmap-item">
          <strong>{{ panel.title }}</strong>
          <small>{{ panel.description }}</small>
          <label><input v-model="panel.user_visible" type="checkbox" :true-value="true" :false-value="false" /> 표시</label>
          <div class="auth-actions">
            <button class="identity-card__logout" type="button" @click="move(index, -1)">위로</button>
            <button class="identity-card__logout" type="button" @click="move(index, 1)">아래로</button>
          </div>
        </div>
      </div>
      <button class="refresh-button" type="button" @click="save">설정 저장</button>
    </section>
  </AppShell>
</template>
