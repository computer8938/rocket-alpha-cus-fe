<script setup lang="ts">
defineProps<{
  label: string
  value: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}>()
</script>

<template>
  <article class="status-card" :data-tone="tone ?? 'default'">
    <p class="status-label">{{ label }}</p>
    <strong class="status-value">{{ value }}</strong>
  </article>
</template>
