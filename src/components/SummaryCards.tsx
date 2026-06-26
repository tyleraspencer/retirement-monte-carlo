import type { AggregatedResults } from '../types'
import { formatCompactCurrency, formatCurrency, formatPercent } from '../utils/format'

interface SummaryCardsProps {
  results: AggregatedResults | null
  loading: boolean
}

export function SummaryCards({ results, loading }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Success Rate',
      value: results ? formatPercent(results.successRate, 1) : '—',
      title: undefined,
      sub: 'Portfolio lasts to end age',
      accent: results && results.successRate >= 0.8 ? 'text-emerald-600' : results && results.successRate >= 0.5 ? 'text-amber-600' : 'text-red-600',
    },
    {
      label: 'Median Final Wealth',
      value: results ? formatCompactCurrency(results.medianFinalBalance) : '—',
      title: results ? formatCurrency(results.medianFinalBalance) : undefined,
      sub: '50th percentile at end age',
      accent: 'text-slate-900',
    },
    {
      label: 'Median Depletion Age',
      value:
        results?.medianDepletionAge != null
          ? `Age ${Math.round(results.medianDepletionAge)}`
          : results
            ? 'Never'
            : '—',
      title: undefined,
      sub: 'Among failed trials',
      accent: 'text-slate-900',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${loading ? 'opacity-60' : ''}`}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {card.label}
          </p>
          <p
            title={card.title}
            className={`mt-1 truncate text-2xl font-bold tabular-nums leading-tight sm:text-3xl ${card.accent}`}
          >
            {card.value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}
