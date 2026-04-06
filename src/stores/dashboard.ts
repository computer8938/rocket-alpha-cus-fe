import { defineStore } from 'pinia'

import { fetchDashboardSnapshot } from '../services/dashboardApi'
import type { DashboardSnapshot } from '../types/dashboard'

interface DashboardState {
  snapshot: DashboardSnapshot | null
  loading: boolean
  refreshing: boolean
  error: string | null
  lastUpdatedAt: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    snapshot: null,
    loading: false,
    refreshing: false,
    error: null,
    lastUpdatedAt: null,
  }),
  getters: {
    hasSnapshot: (state) => state.snapshot !== null,
  },
  actions: {
    async refresh() {
      if (this.snapshot === null) {
        this.loading = true
      } else {
        this.refreshing = true
      }

      this.error = null

      try {
        this.snapshot = await fetchDashboardSnapshot()
        this.lastUpdatedAt = new Date().toISOString()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown dashboard error'
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },
  },
})
