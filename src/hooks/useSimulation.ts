import { useCallback, useEffect, useRef, useState } from 'react'
import { isValidParams } from '../defaults'
import type { AggregatedResults, SimulationParams } from '../types'
import SimulationWorker from '../simulation/worker?worker'

const DEBOUNCE_MS = 300

export function useSimulation(params: SimulationParams, enabled = true) {
  const [results, setResults] = useState<AggregatedResults | null>(null)
  const [loading, setLoading] = useState(false)
  const workerRef = useRef<Worker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled) {
      workerRef.current?.terminate()
      workerRef.current = null
      setLoading(false)
      return
    }

    workerRef.current = new SimulationWorker()
    workerRef.current.onmessage = (event) => {
      if (event.data.type === 'result') {
        setResults(event.data.results)
        setLoading(false)
      }
    }
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [enabled])

  const run = useCallback((nextParams: SimulationParams) => {
    if (!enabled || !isValidParams(nextParams) || !workerRef.current) return
    setLoading(true)
    workerRef.current.postMessage({ type: 'run', params: nextParams })
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => run(params), DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [params, run, enabled])

  return { results, loading }
}
