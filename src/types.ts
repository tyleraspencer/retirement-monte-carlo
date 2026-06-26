export type SamplingMode = 'bootstrap' | 'sequential'

export interface SimulationParams {
  currentAge: number
  retirementAge: number
  endAge: number
  currentNetWorth: number

  annualContributions: number
  contributionGrowthRate: number
  preRetirementExpenses: number

  annualSpending: number
  inflationRate: number

  socialSecurityAnnual: number
  socialSecurityStartAge: number
  pensionAnnual: number
  pensionStartAge: number
  otherIncomeAnnual: number
  otherIncomeEndAge: number

  samplingMode: SamplingMode
  numTrials: number
  randomSeed: number | null
}

export interface TrialResult {
  path: number[]
  success: boolean
  depletionAge: number | null
  finalBalance: number
}

export interface PercentilePath {
  age: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
}

export interface HistogramBin {
  label: string
  min: number
  max: number
  count: number
}

export interface AggregatedResults {
  successRate: number
  medianFinalBalance: number
  medianDepletionAge: number | null
  percentilePaths: PercentilePath[]
  depletionHistogram: HistogramBin[]
  finalWealthHistogram: HistogramBin[]
  ages: number[]
}

export interface WorkerRequest {
  type: 'run'
  params: SimulationParams
}

export interface WorkerResponse {
  type: 'result'
  results: AggregatedResults
}
