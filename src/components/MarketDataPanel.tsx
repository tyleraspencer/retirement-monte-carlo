import { HISTORICAL_STATS, SP500_ANNUAL_RETURNS } from '../data/sp500Returns'
import { formatPercent } from '../utils/format'

export function MarketDataPanel() {
  const stats = HISTORICAL_STATS

  return (
    <section className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-input)] p-4">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">
        Market Data
      </h3>
      <p className="mb-3 text-xs leading-relaxed text-[var(--text-muted)]">
        S&amp;P 500 total returns, {stats.startYear}–{stats.endYear}. Past performance does not
        guarantee future results.
      </p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[13px]">
        <div>
          <dt className="text-[var(--text-faint)]">Years</dt>
          <dd className="font-medium tabular-nums text-[var(--text)]">{stats.count}</dd>
        </div>
        <div>
          <dt className="text-[var(--text-faint)]">Mean return</dt>
          <dd className="font-medium tabular-nums text-[var(--text)]">
            {formatPercent(stats.meanReturn)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--text-faint)]">Std deviation</dt>
          <dd className="font-medium tabular-nums text-[var(--text)]">
            {formatPercent(stats.stdDev)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--text-faint)]">Positive years</dt>
          <dd className="font-medium tabular-nums text-[var(--text)]">
            {formatPercent(stats.positiveYearPct, 0)}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--text-faint)]">Best year</dt>
          <dd className="font-medium tabular-nums text-[var(--success)]">
            {stats.bestYear.year} ({formatPercent(stats.bestYear.totalReturn)})
          </dd>
        </div>
        <div>
          <dt className="text-[var(--text-faint)]">Worst year</dt>
          <dd className="font-medium tabular-nums text-[var(--danger)]">
            {stats.worstYear.year} ({formatPercent(stats.worstYear.totalReturn)})
          </dd>
        </div>
      </dl>
      <div className="mt-4 h-14">
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
                fill={entry.totalReturn >= 0 ? '#3dd68c' : '#f07178'}
                opacity={0.75}
              />
            )
          })}
          <line
            x1={0}
            y1={20}
            x2={SP500_ANNUAL_RETURNS.length}
            y2={20}
            stroke="#5c6578"
            strokeWidth={0.2}
          />
        </svg>
        <p className="mt-1 text-center text-[10px] text-[var(--text-faint)]">
          Annual returns ({stats.startYear}–{stats.endYear})
        </p>
      </div>
    </section>
  )
}
