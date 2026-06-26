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
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <h1 className="text-2xl font-bold text-slate-900">
          Retirement Monte Carlo Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Full-lifecycle simulation using 100 years of historical S&P 500 returns
        </p>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 p-4 lg:grid-cols-[360px_1fr] lg:p-6">
        <aside className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
          <ParameterForm params={params} onChange={setParams} />
          <MarketDataPanel />
        </aside>

        <main className="relative space-y-6">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-3 shadow-lg">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                <span className="text-sm font-medium text-slate-700">
                  Running {params.numTrials.toLocaleString()} trials…
                </span>
              </div>
            </div>
          )}

          <SummaryCards results={results} loading={loading} />
          <FanChart results={results} retirementAge={params.retirementAge} />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <FailureChart results={results} />
            <WealthHistogram results={results} />
          </div>

          <p className="text-center text-xs text-slate-400 pb-4">
            For illustrative purposes only. Past performance does not guarantee future results.
            This is not financial advice.
          </p>
        </main>
      </div>
    </div>
  )
}

export default App
