import useSaleQueries from '@/http/tanstack/useSaleQueries'
import { useEffect, useState } from 'react'

const useSaleResults = (start?: string, end?: string) => {
  const [queryTotalCost, setQueryTotalCost] = useState(0)
  const [queryTotalRevenue, setQueryTotalRevenue] = useState(0)
  const [queryTotalProfit, setQueryTotalProfit] = useState(0)

  const { sales } = useSaleQueries(start, end)

  useEffect(() => {
    const tc = sales.reduce(
      (total, v) => total + (v.total_cost?.amount || 0),
      0,
    )
    const tr = sales.reduce(
      (total, v) => total + (v.total_revenue?.amount || 0),
      0,
    )
    const tp = sales.reduce(
      (total, v) => total + (v.total_profit?.amount || 0),
      0,
    )

    setQueryTotalCost(tc)
    setQueryTotalRevenue(tr)
    setQueryTotalProfit(tp)
  }, [sales])

  return {
    queryTotalCost,
    queryTotalRevenue,
    queryTotalProfit,
  }
}

export default useSaleResults
