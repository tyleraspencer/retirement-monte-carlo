import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AggregatedResults } from '../types'

interface WealthHistogramProps {
  results: AggregatedResults | null
}

const tooltipStyle = {
  backgroundColor: '#151a24',
  border: '1px solid #252b38',
  borderRadius: 8,
  color: '#e8ecf4',
  fontSize: 12,
}

export function WealthHistogram({ results }: WealthHistogramProps) {
  if (!results) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-faint)]">
        Awaiting simulation
      </div>
    )
  }

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">Final Portfolio Distribution</h3>
        <span className="text-xs text-[var(--text-faint)]">Ending balances</span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={results.finalWealthHistogram} margin={{ top: 4, right: 4, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c2230" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#5c6578' }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={56}
            axisLine={{ stroke: '#252b38' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#5c6578' }}
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${Number(value ?? 0)} trials`, 'Count']}
          />
          <Bar dataKey="count" fill="#4f8cff" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
