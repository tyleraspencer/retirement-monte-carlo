import type { AggregatedResults, SimulationParams } from '../types'
import { aggregateResults } from './aggregate'
import { createReturnSampler } from './historicalReturns'
import { createRng } from './random'
import { runTrial } from './runTrial'

export function runSimulation(params: SimulationParams): AggregatedResults {
  const rng = createRng(params.randomSeed)
  const trials = []

  for (let i = 0; i < params.numTrials; i++) {
    const sampler = createReturnSampler(params.samplingMode, rng)
    trials.push(runTrial(params, sampler))
  }

  return aggregateResults(trials, params)
}
