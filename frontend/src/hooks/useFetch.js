import { useEffect, useState, useCallback } from 'react'
import { getErrorMessage } from '../api/endpoints'

// Simple data loader: const { data, loading, error, reload } = useFetch(servicesApi.list)
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(() => {
    setLoading(true)
    setError('')
    return fn()
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    reload()
  }, [reload])

  return { data, setData, loading, error, reload }
}
