import type {
  DashboardSnapshot,
  ProcessorStatusResponse,
  ScraperStatusResponse,
  ServiceHealthResponse,
} from '../types/dashboard'

const SCRAPER_API_BASE = import.meta.env.VITE_SCRAPER_API_BASE ?? '/api/scraper'
const PROCESSOR_API_BASE = import.meta.env.VITE_PROCESSOR_API_BASE ?? '/api/processor'

async function fetchJson<T>(input: string): Promise<T> {
  const response = await fetch(input, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export async function fetchDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [scraperHealth, scraperStatus, processorHealth, processorStatus] =
    await Promise.all([
      fetchJson<ServiceHealthResponse>(`${SCRAPER_API_BASE}/health`),
      fetchJson<ScraperStatusResponse>(`${SCRAPER_API_BASE}/status`),
      fetchJson<ServiceHealthResponse>(`${PROCESSOR_API_BASE}/health`),
      fetchJson<ProcessorStatusResponse>(`${PROCESSOR_API_BASE}/status`),
    ])

  return {
    scraperHealth,
    scraperStatus,
    processorHealth,
    processorStatus,
  }
}
