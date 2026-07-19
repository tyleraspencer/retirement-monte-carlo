export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

/** Shorter display for large values in tight UI slots (e.g. summary cards). */
export function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) {
    const millions = value / 1_000_000
    return `$${millions.toFixed(millions >= 100 ? 0 : millions >= 10 ? 1 : 2)}M`
  }
  if (abs >= 10_000) {
    return `$${Math.round(value / 1_000)}K`
  }
  return formatCurrency(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function parseCurrencyInput(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  if (digits === '') return 0
  const parsed = parseInt(digits, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function parsePercentInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  const parsed = parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed / 100 : 0
}
