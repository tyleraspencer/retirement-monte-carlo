import type { AggregatedResults, SimulationParams } from '../types'
import { formatCompactCurrency, formatCurrency, formatPercent } from '../utils/format'

interface SummaryCardsProps {
  results: AggregatedResults | null
  params: SimulationParams
  loading: boolean
}

function successTone(rate: number | null) {
  if (rate == null) return 'text-[var(--text)]'
  if (rate >= 0.8) return 'text-[var(--success)]'
  if (rate >= 0.5) return 'text-[var(--warning)]'
  return 'text-[var(--danger)]'
}

type PlanTone = 'neutral' | 'success' | 'warning' | 'danger'

function planTone(rate: number | null): PlanTone {
  if (rate == null) return 'neutral'
  if (rate >= 0.8) return 'success'
  if (rate >= 0.5) return 'warning'
  return 'danger'
}

function depletionTone(
  results: AggregatedResults | null,
): { accent: string; shell: string } {
  if (!results) {
    return {
      accent: 'text-[var(--text)]',
      shell: 'border-[var(--border)] bg-[var(--bg-elevated)]',
    }
  }

  // Never depletes among failures → healthy signal
  if (results.medianDepletionAge == null) {
    return {
      accent: 'text-[var(--success)]',
      shell: 'border-[var(--success)]/35 bg-[var(--success-soft)]',
    }
  }

  // Otherwise color by overall plan success/failure
  const tone = planTone(results.successRate)
  if (tone === 'success') {
    return {
      accent: 'text-[var(--warning)]',
      shell: 'border-[var(--warning)]/35 bg-[var(--warning-soft)]',
    }
  }
  if (tone === 'warning') {
    return {
      accent: 'text-[var(--warning)]',
      shell: 'border-[var(--warning)]/40 bg-[var(--warning-soft)]',
    }
  }
  return {
    accent: 'text-[var(--danger)]',
    shell: 'border-[var(--danger)]/40 bg-[var(--danger-soft)]',
  }
}

function buildNarrative(
  results: AggregatedResults | null,
  params: SimulationParams,
): { body: string; pills: { label: string; tone: 'success' | 'accent' | 'muted' }[] } {
  const horizon = params.endAge - params.retirementAge
  const yearsToRetire = params.retirementAge - params.currentAge
  const modeLabel =
    params.samplingMode === 'bootstrap' ? 'bootstrapped historical returns' : 'sequential historical blocks'

  if (!results) {
    return {
      body: `Simulating a ${yearsToRetire}-year accumulation phase into a ${horizon}-year retirement using ${modeLabel}. Results appear once the first run completes.`,
      pills: [
        { label: `${horizon}-year horizon`, tone: 'muted' },
        { label: `${params.numTrials.toLocaleString()} trials`, tone: 'accent' },
      ],
    }
  }

  const successPct = formatPercent(results.successRate, 1)
  const solvent = Math.round(results.successRate * params.numTrials)
  const median = formatCompactCurrency(results.medianFinalBalance)
  const depletion =
    results.medianDepletionAge != null
      ? ` Failed trials typically deplete around age ${Math.round(results.medianDepletionAge)}.`
      : ' Across failed trials, depletion timing varies.'

  const body =
    results.successRate >= 0.8
      ? `Your plan lasts to age ${params.endAge} in ${successPct} of simulations (${solvent.toLocaleString()} of ${params.numTrials.toLocaleString()}). Median ending balance is ${median}.${depletion}`
      : results.successRate >= 0.5
        ? `Your plan succeeds in ${successPct} of simulations (${solvent.toLocaleString()} of ${params.numTrials.toLocaleString()}). Median ending balance is ${median} — consider lowering spending or extending accumulation.${depletion}`
        : `Only ${successPct} of simulations last to age ${params.endAge}. Median ending balance is ${median}. Raising savings, delaying retirement, or cutting spending would improve odds.${depletion}`

  return {
    body,
    pills: [
      {
        label: `${successPct} success`,
        tone: results.successRate >= 0.8 ? 'success' : results.successRate >= 0.5 ? 'accent' : 'muted',
      },
      { label: `${horizon}-year horizon`, tone: 'muted' },
      { label: modeLabel.includes('bootstrap') ? 'Bootstrap sampling' : 'Sequential sampling', tone: 'accent' },
    ],
  }
}

export function SummaryCards({ results, params, loading }: SummaryCardsProps) {
  const narrative = buildNarrative(results, params)
  const lastPath = results?.percentilePaths[results.percentilePaths.length - 1]
  const p10Final = lastPath?.p10
  const solventCount = results
    ? Math.round(results.successRate * params.numTrials)
    : null

  const depletion = depletionTone(results)

  const cards = [
    {
      label: 'Probability of Success',
      value: results ? formatPercent(results.successRate, 1) : '—',
      title: undefined as string | undefined,
      sub:
        solventCount != null
          ? `${solventCount.toLocaleString()} of ${params.numTrials.toLocaleString()} sims solvent`
          : 'Portfolio lasts to end age',
      accent: successTone(results?.successRate ?? null),
      shell: 'border-[var(--border)] bg-[var(--bg-elevated)]',
    },
    {
      label: 'Median Final Balance',
      value: results ? formatCompactCurrency(results.medianFinalBalance) : '—',
      title: results ? formatCurrency(results.medianFinalBalance) : undefined,
      sub: '50th percentile at end age',
      accent: 'text-[var(--text)]',
      shell: 'border-[var(--border)] bg-[var(--bg-elevated)]',
    },
    {
      label: '10th Pct. Final Balance',
      value: p10Final != null ? formatCompactCurrency(p10Final) : '—',
      title: p10Final != null ? formatCurrency(p10Final) : undefined,
      sub: 'Bad-luck scenario floor',
      accent: 'text-[var(--text)]',
      shell: 'border-[var(--border)] bg-[var(--bg-elevated)]',
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
      sub:
        results?.medianDepletionAge == null && results
          ? 'No failed trials depleted'
          : 'Among failed trials',
      accent: depletion.accent,
      shell: depletion.shell,
    },
  ]

  const pillClass = (tone: 'success' | 'accent' | 'muted') => {
    if (tone === 'success') {
      return 'border-[var(--success)]/40 bg-[var(--success-soft)] text-[var(--success)]'
    }
    if (tone === 'accent') {
      return 'border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]'
    }
    return 'border-[var(--border)] bg-[var(--bg-input)] text-[var(--text-muted)]'
  }

  return (
    <div className={`space-y-4 ${loading ? 'opacity-80' : ''}`}>
      <div className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)]">
        <div className="absolute inset-y-0 left-0 w-1 bg-[var(--success)]" />
        <div className="px-5 py-4 pl-6">
          <p className="text-[15px] leading-relaxed text-[var(--text)]">{narrative.body}</p>
          <div className="mt-3.5 flex flex-wrap gap-2">
            {narrative.pills.map((pill) => (
              <span
                key={pill.label}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium ${pillClass(pill.tone)}`}
              >
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`min-w-0 rounded-[var(--radius)] border px-4 py-4 ${card.shell}`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-faint)]">
              {card.label}
            </p>
            <p
              title={card.title}
              className={`mt-1.5 truncate text-2xl font-semibold tabular-nums leading-snug tracking-tight sm:text-[1.65rem] ${card.accent}`}
            >
              {card.value}
            </p>
            <p className="mt-1.5 text-xs text-[var(--text-faint)]">{card.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
