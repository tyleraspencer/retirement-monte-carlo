import { SP500_ANNUAL_RETURNS } from '../data/sp500Returns'
import type { SamplingMode } from '../types'
import type { RNG } from './random'

export interface ReturnSampler {
  reset(): void
  next(): number
}

export function createReturnSampler(
  mode: SamplingMode,
  rng: RNG,
): ReturnSampler {
  const returns = SP500_ANNUAL_RETURNS
  const n = returns.length
  let index = 0

  return {
    reset() {
      if (mode === 'sequential') {
        index = rng.int(0, n - 1)
      }
    },
    next() {
      if (mode === 'bootstrap') {
        return returns[rng.int(0, n - 1)].totalReturn
      }
      const value = returns[index].totalReturn
      index = (index + 1) % n
      return value
    },
  }
}
