export interface CustomerSummarySection {
  key: string
  title: string
  count: number
}

export async function fetchCustomerSummary(): Promise<CustomerSummarySection[]> {
  const response = await fetch('/api/customer/summary', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Customer API failed: ${response.status}`)
  }

  const payload = (await response.json()) as { sections: CustomerSummarySection[] }
  return payload.sections
}
