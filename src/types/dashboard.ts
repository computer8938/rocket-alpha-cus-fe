export interface ServiceHealthResponse {
  service: string
  status: string
  worker_state: string
  last_error: string | null
}

export interface ScrapeMetricsBucket {
  tasks_total?: number
  tasks_succeeded?: number
  tasks_failed?: number
  success_rate_pct?: number
  failure_rate_pct?: number
  inserted?: number
  duplicate?: number
  cache_skipped?: number
  articles_total?: number
}

export interface ScraperStatusResponse {
  service_name: string
  description: string
  version: string
  worker_state: string
  uptime_seconds: number
  last_cycle_started_at: string | null
  last_cycle_completed_at: string | null
  last_dry_run_at: string | null
  last_dry_run_summary: Record<string, unknown> | null
  last_metadata_sync_at: string | null
  last_metadata_sync_date: string | null
  last_metadata_sync_dates_by_market: Record<string, string | null> | null
  last_metadata_sync_summary: Record<string, unknown> | null
  last_task_summary: Record<string, unknown> | null
  last_error: string | null
  scrape_metrics?: {
    markets?: Record<string, ScrapeMetricsBucket>
    last_updated_at_epoch?: number | null
  }
  kafka_lag?: Record<
    string,
    {
      topic?: string
      group_id?: string
      partition_count?: number
      lag_total?: number
      error?: string | null
    }
  >
}

export interface ProcessorStatusResponse {
  service_name: string
  description: string
  version: string
  worker_state: string
  uptime_seconds: number
  last_error: string | null
}

export interface DashboardSnapshot {
  scraperHealth: ServiceHealthResponse
  scraperStatus: ScraperStatusResponse
  processorHealth: ServiceHealthResponse
  processorStatus: ProcessorStatusResponse
}
