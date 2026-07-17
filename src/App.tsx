import { useState } from 'react'
import { createCompareParamsB, DEFAULT_PARAMS } from './defaults'
import { useSimulation } from './hooks/useSimulation'
import { FanChart } from './components/FanChart'
import { FailureChart } from './components/FailureChart'
import { MarketDataPanel } from './components/MarketDataPanel'
import { ParameterForm } from './components/ParameterForm'
import { SummaryCards } from './components/SummaryCards'
import { WealthHistogram } from './components/WealthHistogram'
import type { SimulationParams } from './types'

type ActivePlan = 'A' | 'B'

function App() {
  const [paramsA, setParamsA] = useState(DEFAULT_PARAMS)
  const [paramsB, setParamsB] = useState(() => createCompareParamsB(DEFAULT_PARAMS))
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [activePlan, setActivePlan] = useState<ActivePlan>('A')

  const simA = useSimulation(paramsA, true)
  const simB = useSimulation(paramsB, compareEnabled)

  const activeParams = activePlan === 'A' ? paramsA : paramsB
  const setActiveParams = (next: SimulationParams) => {
    if (activePlan === 'A') setParamsA(next)
    else setParamsB(next)
  }

  const loading = simA.loading || (compareEnabled && simB.loading)
  const trialLabel = compareEnabled
    ? `${paramsA.numTrials.toLocaleString()} × 2 plans`
    : paramsA.numTrials.toLocaleString()

  const enableCompare = () => {
    setParamsB(createCompareParamsB(paramsA))
    setCompareEnabled(true)
    setActivePlan('B')
  }

  const disableCompare = () => {
    setCompareEnabled(false)
    setActivePlan('A')
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-[var(--border)] bg-[var(--bg-panel)] lg:h-full lg:w-[340px] lg:border-b-0 lg:border-r xl:w-[380px]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-[1.35rem] font-semibold tracking-tight text-[var(--text)]">
                  Retirement Simulator
                </h1>
                <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                  Monte Carlo · 100 years of market data
                </p>
              </div>
              <button
                type="button"
                onClick={() => (compareEnabled ? disableCompare() : enableCompare())}
                className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  compareEnabled
                    ? 'border-[var(--compare-b)]/40 bg-[var(--compare-b-soft)] text-[var(--compare-b)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {compareEnabled ? 'Comparing' : 'Compare'}
              </button>
            </div>

            {compareEnabled && (
              <div className="mt-4 space-y-2">
                <div
                  className="grid grid-cols-2 rounded-lg border border-[var(--border)] bg-[var(--bg-input)] p-0.5"
                  role="group"
                  aria-label="Active plan"
                >
                  {(['A', 'B'] as const).map((plan) => {
                    const active = activePlan === plan
                    const color =
                      plan === 'A' ? 'var(--accent)' : 'var(--compare-b)'
                    const soft =
                      plan === 'A' ? 'var(--accent-soft)' : 'var(--compare-b-soft)'
                    return (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setActivePlan(plan)}
                        className={`flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                          active ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                        }`}
                        style={active ? { background: soft, color } : undefined}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: color }}
                        />
                        Plan {plan}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setParamsB({ ...paramsA })}
                  className="w-full rounded-lg border border-[var(--border)] px-3 py-1.5 text-[12px] text-[var(--text-muted)] transition-colors hover:border-[var(--border)] hover:text-[var(--text)]"
                >
                  Copy A → B
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {compareEnabled && (
              <p className="text-xs text-[var(--text-faint)]">
                Editing{' '}
                <span
                  className="font-medium"
                  style={{ color: activePlan === 'A' ? 'var(--accent)' : 'var(--compare-b)' }}
                >
                  Plan {activePlan}
                </span>
              </p>
            )}
            <ParameterForm params={activeParams} onChange={setActiveParams} />
            <MarketDataPanel />
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-[var(--bg)]/50 pt-24 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                <span className="text-sm text-[var(--text-muted)]">
                  Running {trialLabel} trials…
                </span>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 px-3.5 py-2.5 text-[13px] text-[var(--text-muted)]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[11px] text-[var(--text-faint)]">
              i
            </span>
            <span>
              {compareEnabled
                ? 'Compare mode: edit Plan A and Plan B separately — medians and KPIs update side by side.'
                : 'New to Monte Carlo simulations? Adjust inputs on the left — results update automatically from historical S&P 500 returns.'}
            </span>
          </div>

          <div className={`space-y-5 ${loading ? 'opacity-70 transition-opacity' : ''}`}>
            <SummaryCards
              results={simA.results}
              params={compareEnabled ? (activePlan === 'A' ? paramsA : paramsB) : paramsA}
              loading={loading}
              compare={
                compareEnabled
                  ? {
                      resultsA: simA.results,
                      resultsB: simB.results,
                      paramsA,
                      paramsB,
                      activePlan,
                    }
                  : undefined
              }
            />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
              <FanChart
                results={simA.results}
                retirementAge={paramsA.retirementAge}
                compareResults={compareEnabled ? simB.results : null}
                compareRetirementAge={compareEnabled ? paramsB.retirementAge : undefined}
              />
              <WealthHistogram
                results={simA.results}
                compareResults={compareEnabled ? simB.results : null}
              />
            </div>

            <FailureChart
              results={simA.results}
              compareResults={compareEnabled ? simB.results : null}
            />

            <p className="pb-2 text-center text-xs text-[var(--text-faint)]">
              For illustrative purposes only. Past performance does not guarantee future results.
              This is not financial advice.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
