import type { WorkerRequest, WorkerResponse } from '../types'
import { runSimulation } from './runSimulation'

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type === 'run') {
    const results = runSimulation(event.data.params)
    const response: WorkerResponse = { type: 'result', results }
    self.postMessage(response)
  }
}
