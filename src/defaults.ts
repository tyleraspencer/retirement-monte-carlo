import type { SimulationParams } from './types'

export const DEFAULT_PARAMS: SimulationParams = {
  currentAge: 35,
  retirementAge: 65,
  endAge: 95,
  currentNetWorth: 100_000,

  contributionMode: 'salary',
  annualSalary: 100_000,
  savingsRate: 0.2,
  salaryGrowthRate: 0.03,
  annualContributions: 20_000,
  contributionGrowthRate: 0,
  preRetirementExpenses: 0,

  annualSpending: 60_000,
  inflationRate: 0.03,

  socialSecurityAnnual: 0,
  socialSecurityStartAge: 67,
  pensionAnnual: 0,
  pensionStartAge: 65,
  otherIncomeAnnual: 0,
  otherIncomeEndAge: 70,

  samplingMode: 'bootstrap',
  numTrials: 5000,
  randomSeed: null,
}

export interface ValidationError {
  field: keyof SimulationParams
  message: string
}

export function validateParams(params: SimulationParams): ValidationError[] {
  const errors: ValidationError[] = []

  if (params.currentAge >= params.retirementAge) {
    errors.push({
      field: 'currentAge',
      message: 'Current age must be less than retirement age',
    })
  }
  if (params.retirementAge >= params.endAge) {
    errors.push({
      field: 'retirementAge',
      message: 'Retirement age must be less than end age',
    })
  }
  if (params.currentNetWorth < 0) {
    errors.push({ field: 'currentNetWorth', message: 'Net worth cannot be negative' })
  }
  if (params.contributionMode === 'salary') {
    if (params.annualSalary < 0) {
      errors.push({ field: 'annualSalary', message: 'Salary cannot be negative' })
    }
    if (params.savingsRate < 0 || params.savingsRate > 1) {
      errors.push({
        field: 'savingsRate',
        message: 'Savings rate must be between 0% and 100%',
      })
    }
  }
  if (params.numTrials < 100 || params.numTrials > 20_000) {
    errors.push({
      field: 'numTrials',
      message: 'Trials must be between 100 and 20,000',
    })
  }

  return errors
}

export function isValidParams(params: SimulationParams): boolean {
  return validateParams(params).length === 0
}
