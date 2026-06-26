import { useCallback, useEffect, useRef, useState } from 'react'
import { isValidParams } from '../defaults'
import type { AggregatedResults, SimulationParams } from '../types'
import SimulationWorker from '../simulation/worker?worker'

const DEBOUNCE_MS = 300

export function useSimulation(params: SimulationParams) {
  const [results, setResults] = useState<AggregatedResults | null>(null)
  const [loading, setLoading] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    workerRef.current = new SimulationWorker()
    workerRef.current.onmessage = (event) => {
      if (event.data.type === 'result') {
        setResults(event.data.results)
        setLoading(false)
      }
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const run = useCallback((nextParams: SimulationParams) => {
    if (!isValidParams(nextParams) || !workerRef.current) return
    setLoading(true)
    workerRef.current.postMessage({ type: 'run', params: nextParams })
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => run(params), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [params, run])

  return { results, loading }
}
