import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AggregatedResults } from '../types'
import { formatCurrency } from '../utils/format'

interface FanChartProps {
  results: AggregatedResults | null
  retirementAge: number
}

const tooltipStyle = {
  backgroundColor: '#151a24',
  border: '1px solid #252b38',
  borderRadius: 8,
  color: '#e8ecf4',
  fontSize: 12,
}

function formatAxis(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

export function FanChart({ results, retirementAge }: FanChartProps) {
  if (!results) {
    return (
      <div className="flex h-80 items-center justify-center rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] text-sm text-[var(--text-faint)]">
        Run simulation to see portfolio paths
      </div>
    )
  }

  const data = results.percentilePaths.map((row) => ({
    ...row,
    band90: row.p90 - row.p10,
    band75: row.p75 - row.p25,
    base10: row.p10,
    base25: row.p25,
  }))

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">Portfolio Value Over Time</h3>
        <span className="text-xs text-[var(--text-faint)]">Percentile bands</span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <defs>
            <linearGradient id="bandOuter" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity={0.06} />
            </linearGradient>
            <linearGradient id="bandInner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.38} />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity={0.14} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c2230" vertical={false} />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 11, fill: '#5c6578' }}
            axisLine={{ stroke: '#252b38' }}
            tickLine={false}
            label={{
              value: 'Age',
              position: 'insideBottom',
              offset: -2,
              fontSize: 11,
              fill: '#5c6578',
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#5c6578' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatAxis}
            width={56}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => formatCurrency(Number(value ?? 0))}
            labelFormatter={(age) => `Age ${age}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#8b93a7', paddingTop: 8 }}
            iconType="plainline"
          />
          <ReferenceLine
            x={retirementAge}
            stroke="#e6a23c"
            strokeDasharray="4 4"
            label={{ value: 'Retirement', position: 'insideTopRight', fontSize: 11, fill: '#e6a23c' }}
          />
          <Area
            type="monotone"
            dataKey="base10"
            stackId="outer"
            stroke="none"
            fill="transparent"
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="band90"
            stackId="outer"
            stroke="none"
            fill="url(#bandOuter)"
            name="10th–90th"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="base25"
            stackId="inner"
            stroke="none"
            fill="transparent"
            legendType="none"
            tooltipType="none"
          />
          <Area
            type="monotone"
            dataKey="band75"
            stackId="inner"
            stroke="none"
            fill="url(#bandInner)"
            name="25th–75th"
            tooltipType="none"
          />
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#4f8cff"
            strokeWidth={2.5}
            dot={false}
            name="Median"
            activeDot={{ r: 4, fill: '#4f8cff' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
