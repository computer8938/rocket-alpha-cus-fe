<script setup lang="ts">
import type { ScrapeMetricsBucket } from '../../types/dashboard'

import { formatNumber, formatPercent } from '../../utils/format'

defineProps<{
  metrics: Record<string, ScrapeMetricsBucket>
}>()
</script>

<template>
  <div class="table-shell">
    <table class="metrics-table">
      <thead>
        <tr>
          <th>Market</th>
          <th>Tasks</th>
          <th>Success</th>
          <th>Fail</th>
          <th>Inserted</th>
          <th>Articles</th>
          <th>Success %</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bucket, market) in metrics" :key="market">
          <td>{{ market }}</td>
          <td>{{ formatNumber(bucket.tasks_total) }}</td>
          <td>{{ formatNumber(bucket.tasks_succeeded) }}</td>
          <td>{{ formatNumber(bucket.tasks_failed) }}</td>
          <td>{{ formatNumber(bucket.inserted) }}</td>
          <td>{{ formatNumber(bucket.articles_total) }}</td>
          <td>{{ formatPercent(bucket.success_rate_pct) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
