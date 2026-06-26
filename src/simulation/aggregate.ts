import type {
  AggregatedResults,
  HistogramBin,
  PercentilePath,
  SimulationParams,
  TrialResult,
} from '../types'

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (sorted.length - 1) * p
  const lower = Math.floor(idx)
  const upper = Math.ceil(idx)
  if (lower === upper) return sorted[lower]
  const weight = idx - lower
  return sorted[lower] * (1 - weight) + sorted[upper] * weight
}

function buildHistogram(
  values: number[],
  binCount: number,
): HistogramBin[] {
  if (values.length === 0) return []

  const min = Math.min(...values)
  const max = Math.max(...values)
  if (min === max) {
    return [{ label: formatBinLabel(min, max), min, max, count: values.length }]
  }

  const step = (max - min) / binCount
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => {
    const binMin = min + step * i
    const binMax = i === binCount - 1 ? max : min + step * (i + 1)
    return {
      label: formatBinLabel(binMin, binMax),
      min: binMin,
      max: binMax,
      count: 0,
    }
  })

  for (const value of values) {
    let idx = Math.floor((value - min) / step)
    if (idx >= binCount) idx = binCount - 1
    bins[idx].count++
  }

  return bins
}

function formatBinLabel(min: number, max: number): string {
  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
        ? `$${Math.round(n / 1_000)}K`
        : `$${Math.round(n)}`
  return `${fmt(min)}–${fmt(max)}`
}

export function aggregateResults(
  trials: TrialResult[],
  params: SimulationParams,
): AggregatedResults {
  const numYears = params.endAge - params.currentAge + 1
  const ages = Array.from(
    { length: numYears },
    (_, i) => params.currentAge + i,
  )

  const successCount = trials.filter((t) => t.success).length
  const successRate = trials.length > 0 ? successCount / trials.length : 0

  const finalBalances = trials.map((t) => t.finalBalance).sort((a, b) => a - b)
  const medianFinalBalance = percentile(finalBalances, 0.5)

  const depletionAges = trials
    .filter((t) => t.depletionAge !== null)
    .map((t) => t.depletionAge as number)
    .sort((a, b) => a - b)
  const medianDepletionAge =
    depletionAges.length > 0 ? percentile(depletionAges, 0.5) : null

  const percentilePaths: PercentilePath[] = ages.map((age, i) => {
    const balances = trials.map((t) => t.path[i] ?? 0).sort((a, b) => a - b)
    return {
      age,
      p10: percentile(balances, 0.1),
      p25: percentile(balances, 0.25),
      p50: percentile(balances, 0.5),
      p75: percentile(balances, 0.75),
      p90: percentile(balances, 0.9),
    }
  })

  return {
    successRate,
    medianFinalBalance,
    medianDepletionAge,
    percentilePaths,
    depletionHistogram: buildHistogram(depletionAges, 12),
    finalWealthHistogram: buildHistogram(finalBalances, 15),
    ages,
  }
}
