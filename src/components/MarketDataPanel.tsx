import { HISTORICAL_STATS, SP500_ANNUAL_RETURNS } from '../data/sp500Returns'
import { formatPercent } from '../utils/format'

export function MarketDataPanel() {
  const stats = HISTORICAL_STATS

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">
        Market Data (S&P 500)
      </h3>
      <p className="mb-3 text-xs text-slate-500">
        Returns sampled from {stats.startYear}–{stats.endYear} historical annual
        total returns. Past performance does not guarantee future results.
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <dt className="text-slate-500">Years of data</dt>
          <dd className="font-medium text-slate-900">{stats.count}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Mean return</dt>
          <dd className="font-medium text-slate-900">
            {formatPercent(stats.meanReturn)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Std deviation</dt>
          <dd className="font-medium text-slate-900">
            {formatPercent(stats.stdDev)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Positive years</dt>
          <dd className="font-medium text-slate-900">
            {formatPercent(stats.positiveYearPct, 0)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Best year</dt>
          <dd className="font-medium text-emerald-700">
            {stats.bestYear.year} ({formatPercent(stats.bestYear.totalReturn)})
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Worst year</dt>
          <dd className="font-medium text-red-700">
            {stats.worstYear.year} ({formatPercent(stats.worstYear.totalReturn)})
          </dd>
        </div>
      </dl>
      <div className="mt-4 h-16">
        <svg
          viewBox={`0 0 ${SP500_ANNUAL_RETURNS.length} 40`}
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          {SP500_ANNUAL_RETURNS.map((entry, i) => {
            const height = Math.min(40, Math.abs(entry.totalReturn) * 80)
            const y = entry.totalReturn >= 0 ? 20 - height : 20
            return (
              <rect
                key={entry.year}
                x={i}
                y={y}
                width={0.9}
                height={height}
                fill={entry.totalReturn >= 0 ? '#10b981' : '#ef4444'}
                opacity={0.7}
              />
            )
          })}
          <line x1={0} y1={20} x2={SP500_ANNUAL_RETURNS.length} y2={20} stroke="#94a3b8" strokeWidth={0.2} />
        </svg>
        <p className="mt-1 text-center text-xs text-slate-400">
          Annual returns sparkline ({stats.startYear}–{stats.endYear})
        </p>
      </div>
    </section>
  )
}
