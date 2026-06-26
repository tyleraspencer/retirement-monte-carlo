import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

export function FanChart({ results, retirementAge }: FanChartProps) {
  if (!results) {
    return (
      <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
        Run simulation to see portfolio paths
      </div>
    )
  }

  const data = results.percentilePaths

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Portfolio Balance Percentiles by Age
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 12 }}
            label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 12 }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? `$${(v / 1_000_000).toFixed(1)}M`
                : v >= 1_000
                  ? `$${(v / 1_000).toFixed(0)}K`
                  : `$${v}`
            }
          />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value ?? 0))}
            labelFormatter={(age) => `Age ${age}`}
          />
          <Legend />
          <ReferenceLine
            x={retirementAge}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={{ value: 'Retirement', position: 'top', fontSize: 11 }}
          />
          <Line type="monotone" dataKey="p90" stroke="#93c5fd" strokeWidth={1} dot={false} name="90th" />
          <Line type="monotone" dataKey="p75" stroke="#60a5fa" strokeWidth={1} dot={false} name="75th" />
          <Line type="monotone" dataKey="p50" stroke="#2563eb" strokeWidth={2} dot={false} name="Median" />
          <Line type="monotone" dataKey="p25" stroke="#60a5fa" strokeWidth={1} dot={false} name="25th" />
          <Line type="monotone" dataKey="p10" stroke="#93c5fd" strokeWidth={1} dot={false} name="10th" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
