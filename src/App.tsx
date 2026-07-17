import { useState } from 'react'
import { DEFAULT_PARAMS } from './defaults'
import { useSimulation } from './hooks/useSimulation'
import { FanChart } from './components/FanChart'
import { FailureChart } from './components/FailureChart'
import { MarketDataPanel } from './components/MarketDataPanel'
import { ParameterForm } from './components/ParameterForm'
import { SummaryCards } from './components/SummaryCards'
import { WealthHistogram } from './components/WealthHistogram'

function App() {
  const [params, setParams] = useState(DEFAULT_PARAMS)
  const { results, loading } = useSimulation(params)

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col lg:flex-row">
        <aside className="flex w-full shrink-0 flex-col border-b border-[var(--border)] bg-[var(--bg-panel)] lg:h-full lg:w-[340px] lg:border-b-0 lg:border-r xl:w-[380px]">
          <div className="border-b border-[var(--border-subtle)] px-5 py-5">
            <h1 className="text-[1.35rem] font-semibold tracking-tight text-[var(--text)]">
              Retirement Simulator
            </h1>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">
              Monte Carlo · 100 years of market data
            </p>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <ParameterForm params={params} onChange={setParams} />
            <MarketDataPanel />
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-[var(--bg)]/50 pt-24 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                <span className="text-sm text-[var(--text-muted)]">
                  Running {params.numTrials.toLocaleString()} trials…
                </span>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)]/80 px-3.5 py-2.5 text-[13px] text-[var(--text-muted)]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[11px] text-[var(--text-faint)]">
              i
            </span>
            <span>
              New to Monte Carlo simulations? Adjust inputs on the left — results update
              automatically from historical S&amp;P 500 returns.
            </span>
          </div>

          <div className={`space-y-5 ${loading ? 'opacity-70 transition-opacity' : ''}`}>
            <SummaryCards results={results} params={params} loading={loading} />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
              <FanChart results={results} retirementAge={params.retirementAge} />
              <WealthHistogram results={results} />
            </div>

            <FailureChart results={results} />

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
