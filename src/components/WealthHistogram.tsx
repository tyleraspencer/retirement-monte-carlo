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

export function WealthHistogram({ results }: WealthHistogramProps) {
  if (!results) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-400">
        Awaiting simulation
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">
        Final Net Worth Distribution
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={results.finalWealthHistogram}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip formatter={(value) => [`${Number(value ?? 0)} trials`, 'Count']} />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
