<script setup lang="ts">
import AppShell from '../components/layout/AppShell.vue'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <AppShell>
    <section class="panel placeholder-panel">
      <div class="panel__header">
        <div>
          <p class="eyebrow">Future module</p>
          <h3>{{ title }}</h3>
        </div>
      </div>

      <p class="sidebar-copy auth-copy">{{ description }}</p>
    </section>
  </AppShell>
</template>
