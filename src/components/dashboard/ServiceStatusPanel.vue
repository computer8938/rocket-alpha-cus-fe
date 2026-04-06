<script setup lang="ts">
import type {
  ProcessorStatusResponse,
  ScraperStatusResponse,
  ServiceHealthResponse,
} from '../../types/dashboard'

import { formatDateTime, formatDurationSeconds } from '../../utils/format'

const props = defineProps<{
  serviceLabel: string
  accent: 'scraper' | 'processor'
  health: ServiceHealthResponse
  status: ScraperStatusResponse | ProcessorStatusResponse
}>()

const detailEntries = [
  {
    label: 'Service',
    value: props.health.service,
  },
  {
    label: 'Worker state',
    value: props.health.worker_state,
  },
  {
    label: 'Uptime',
    value: formatDurationSeconds(props.status.uptime_seconds),
  },
  {
    label: 'Last error',
    value: props.health.last_error ?? '정상',
  },
  {
    label: 'Last cycle',
    value:
      'last_cycle_completed_at' in props.status
        ? formatDateTime(props.status.last_cycle_completed_at)
        : '—',
  },
]
</script>

<template>
  <section class="service-panel" :data-accent="accent">
    <header class="service-panel__header">
      <div>
        <p class="eyebrow">{{ serviceLabel }}</p>
        <h2>{{ health.service }}</h2>
      </div>
      <span class="service-badge" :data-state="health.status">{{ health.status }}</span>
    </header>

    <dl class="service-grid">
      <div v-for="entry in detailEntries" :key="entry.label" class="service-grid__item">
        <dt>{{ entry.label }}</dt>
        <dd>{{ entry.value }}</dd>
      </div>
    </dl>
  </section>
</template>
