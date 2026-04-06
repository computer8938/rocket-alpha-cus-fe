<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AppShell from '../components/layout/AppShell.vue'
import { fetchPanelConfig } from '../services/authApi'
import { fetchCustomerSummary, type CustomerSummarySection } from '../services/customerApi'
import type { PanelConfigItem } from 'rocket-alpha-ui/panels'

const featureCards = ref<CustomerSummarySection[]>([])
const panelConfig = ref<PanelConfigItem[]>([])

onMounted(async () => {
  featureCards.value = await fetchCustomerSummary()
  panelConfig.value = await fetchPanelConfig('customer')
})

function findCount(componentKey: string): number {
  const match = featureCards.value.find((card) => card.key === componentKey.replace('customer-', ''))
  return match?.count ?? 0
}
</script>

<template>
  <AppShell>
    <section class="customer-hero panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Customer service</p>
          <h3>뉴스와 주식 정보를 한곳에서 보는 사용자 포털</h3>
        </div>
      </div>

      <p class="sidebar-copy auth-copy">
        Rocket Alpha 사용자 앱은 국내/해외 뉴스, 국내 주식 관련 정보, SMS/Email 알림 서비스를 중심으로 확장된다.
      </p>

      <div class="role-card-grid">
        <article
          v-for="panel in panelConfig.filter((item) => item.effective_visible).sort((a, b) => a.effective_order - b.effective_order)"
          :key="panel.panel_key"
          class="roadmap-item auth-provider-card"
        >
          <span>{{ panel.title }}</span>
          <small>{{ findCount(panel.component_key) }}개의 초기 콘텐츠/설정 항목이 준비돼 있다.</small>
        </article>
      </div>
    </section>
  </AppShell>
</template>
