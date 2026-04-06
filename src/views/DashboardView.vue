<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

import MetricsTable from '../components/dashboard/MetricsTable.vue'
import ServiceStatusPanel from '../components/dashboard/ServiceStatusPanel.vue'
import StatusOverviewCard from '../components/dashboard/StatusOverviewCard.vue'
import AppShell from '../components/layout/AppShell.vue'
import { useDashboardStore } from '../stores/dashboard'
import { formatDateTime, formatDurationSeconds, formatNumber } from '../utils/format'

const dashboardStore = useDashboardStore()
const { error, hasSnapshot, lastUpdatedAt, loading, refreshing, snapshot } =
  storeToRefs(dashboardStore)

let refreshHandle: number | null = null

const scraperMetrics = computed(() => snapshot.value?.scraperStatus.scrape_metrics?.markets ?? {})
const kafkaLag = computed(() => snapshot.value?.scraperStatus.kafka_lag ?? {})

const overviewCards = computed(() => {
  if (!snapshot.value) {
    return []
  }

  return [
    {
      label: 'Scraper uptime',
      value: formatDurationSeconds(snapshot.value.scraperStatus.uptime_seconds),
      tone: 'default' as const,
    },
    {
      label: 'Processor uptime',
      value: formatDurationSeconds(snapshot.value.processorStatus.uptime_seconds),
      tone: 'default' as const,
    },
    {
      label: 'Last metadata sync',
      value: formatDateTime(snapshot.value.scraperStatus.last_metadata_sync_at),
      tone: 'success' as const,
    },
    {
      label: 'Tracked markets',
      value: formatNumber(Object.keys(scraperMetrics.value).length),
      tone: 'warning' as const,
    },
  ]
})

async function refreshDashboard() {
  await dashboardStore.refresh()
}

onMounted(async () => {
  await refreshDashboard()
  refreshHandle = window.setInterval(() => {
    void refreshDashboard()
  }, 10000)
})

onBeforeUnmount(() => {
  if (refreshHandle !== null) {
    window.clearInterval(refreshHandle)
  }
})
</script>

<template>
  <AppShell>
    <header class="page-header">
      <div>
        <p class="eyebrow">Dashboard MVP</p>
        <h2>서비스 운영 신호를 단일 보드에서 본다.</h2>
      </div>

      <div class="toolbar">
        <span class="toolbar__timestamp">최근 갱신: {{ formatDateTime(lastUpdatedAt) }}</span>
        <button class="refresh-button" :disabled="loading || refreshing" @click="refreshDashboard">
          {{ refreshing ? '동기화 중…' : '새로고침' }}
        </button>
      </div>
    </header>

    <p v-if="error" class="alert-banner">{{ error }}</p>

    <div v-if="loading && !hasSnapshot" class="empty-state">
      <p>Dashboard 데이터를 수집하는 중이다.</p>
    </div>

    <template v-else-if="snapshot">
      <section class="overview-grid">
        <StatusOverviewCard
          v-for="card in overviewCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :tone="card.tone"
        />
      </section>

      <section class="service-layout">
        <ServiceStatusPanel
          service-label="Scraper"
          accent="scraper"
          :health="snapshot.scraperHealth"
          :status="snapshot.scraperStatus"
        />
        <ServiceStatusPanel
          service-label="Processor"
          accent="processor"
          :health="snapshot.processorHealth"
          :status="snapshot.processorStatus"
        />
      </section>

      <section class="dashboard-grid">
        <article class="panel panel--wide">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Scraper metrics</p>
              <h3>시장별 적재/성공률</h3>
            </div>
          </div>

          <MetricsTable :metrics="scraperMetrics" />
        </article>

        <article class="panel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Kafka lag</p>
              <h3>토픽 적체 상태</h3>
            </div>
          </div>

          <ul v-if="Object.keys(kafkaLag).length > 0" class="list-panel">
            <li v-for="(lagInfo, stage) in kafkaLag" :key="stage">
              <div>
                <strong>{{ stage }}</strong>
                <span>{{ lagInfo.topic ?? 'unknown topic' }}</span>
              </div>
              <code>{{ formatNumber(lagInfo.lag_total) }}</code>
            </li>
          </ul>
          <p v-else class="panel-empty">Kafka lag 정보가 아직 없다.</p>
        </article>

        <article class="panel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Metadata sync</p>
              <h3>최근 동기화 스냅샷</h3>
            </div>
          </div>

          <pre>{{ JSON.stringify(snapshot.scraperStatus.last_metadata_sync_summary ?? {}, null, 2) }}</pre>
        </article>

        <article class="panel">
          <div class="panel__header">
            <div>
              <p class="eyebrow">Last task</p>
              <h3>마지막 작업 결과</h3>
            </div>
          </div>

          <pre>{{ JSON.stringify(snapshot.scraperStatus.last_task_summary ?? {}, null, 2) }}</pre>
        </article>
      </section>
    </template>
  </AppShell>
</template>
