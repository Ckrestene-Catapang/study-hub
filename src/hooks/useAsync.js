import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Run an async service function and expose { data, loading, error, refetch }.
 * Keeps components free of manual loading/error boilerplate.
 * Automatically prevents duplicate simultaneous requests.
 *
 * @param {() => Promise<any>} asyncFn
 * @param {any[]} deps
 */
export function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const mounted = useRef(true)
  const inFlightRef = useRef(null)

  const run = useCallback(() => {
    // If a request is already in flight, return the existing promise
    if (inFlightRef.current) {
      return inFlightRef.current
    }

    setLoading(true)
    setError(null)

    const promise = asyncFn()
      .then((result) => {
        if (mounted.current) setData(result)
        return result
      })
      .catch((err) => {
        if (mounted.current) setError(err)
      })
      .finally(() => {
        if (mounted.current) setLoading(false)
        inFlightRef.current = null
      })

    inFlightRef.current = promise
    return promise
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mounted.current = true
    run()
    return () => {
      mounted.current = false
    }
  }, [run])

  return { data, loading, error, refetch: run }
}
