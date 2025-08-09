import { remote } from '@/remotes/remotes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Sale } from '@/models/Sale'

type DateFilter =
  | 'all'
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

const useSalesPage = () => {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  // for filter
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  // Fetch all sales
  const {
    data: sales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sales'],
    queryFn: remote.sales.fetchAll,
  })

  // Create sale
  const createSale = useMutation({
    mutationFn: (data: Partial<Sale>) => remote.sales.store(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  // Update sale
  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sale> }) =>
      remote.sales.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  // Delete sale
  const deleteSale = useMutation({
    mutationFn: (id: number) => remote.sales.destroy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })
  const handleDateFilterChange = (filter: DateFilter) => {
    setDateFilter(filter)
    if (filter !== 'custom') {
      setCustomStartDate('')
      setCustomEndDate('')
    }
  }

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate)
    setCustomEndDate(endDate)
    if (startDate && endDate) {
      setDateFilter('custom')
    }
  }
  return {
    sales,
    search,
    setSearch,
    isLoading,
    isError,
    createSale: createSale.mutate,
    updateSale: updateSale.mutate,
    deleteSale: deleteSale.mutate,

    dateFilter,
    customStartDate,
    customEndDate,
    handleDateFilterChange,
    handleCustomDateChange,
  }
}

export default useSalesPage
