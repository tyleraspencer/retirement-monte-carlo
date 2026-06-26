import type { SimulationParams, TrialResult } from '../types'
import type { ReturnSampler } from './historicalReturns'

function computeIncome(age: number, params: SimulationParams): number {
  let income = 0
  if (age >= params.socialSecurityStartAge) {
    income += params.socialSecurityAnnual
  }
  if (age >= params.pensionStartAge) {
    income += params.pensionAnnual
  }
  if (age <= params.otherIncomeEndAge) {
    income += params.otherIncomeAnnual
  }
  return income
}

export function runTrial(
  params: SimulationParams,
  sampler: ReturnSampler,
): TrialResult {
  let balance = params.currentNetWorth
  const path: number[] = []
  let generalInflation = 1
  let retirementInflation = 1
  let contributionAmount = params.annualContributions
  sampler.reset()

  for (let age = params.currentAge; age <= params.endAge; age++) {
    const r = sampler.next()
    balance *= 1 + r

    if (age < params.retirementAge) {
      balance += contributionAmount
      balance -= params.preRetirementExpenses * generalInflation
      contributionAmount *= 1 + params.contributionGrowthRate
      generalInflation *= 1 + params.inflationRate
    } else {
      const spending = params.annualSpending * retirementInflation
      const income = computeIncome(age, params)
      balance = balance - spending + income
      retirementInflation *= 1 + params.inflationRate
    }

    balance = Math.max(0, balance)
    path.push(balance)

    if (balance === 0 && age < params.endAge) {
      return {
        path,
        success: false,
        depletionAge: age,
        finalBalance: 0,
      }
    }
  }

  return {
    path,
    success: balance > 0,
    depletionAge: null,
    finalBalance: balance,
  }
}
