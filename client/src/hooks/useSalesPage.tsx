import { Sale } from '@/models/Sale'
import { remote } from '@/remotes/remotes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

type DateFilter =
  | 'all'
  | 'today'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'day'
  | 'range'

const useSalesPage = () => {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  // for filter
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // for confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null)

  useEffect(() => {
    handleDateFilterChange('today')
  }, [])

  // Fetch all sales
  const {
    data: sales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sales', startDate, endDate],
    queryFn: () => remote.sales.fetchAll(startDate, endDate),
  })

  // Update sale
  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Sale }) =>
      remote.sales.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  // Delete sale
  const deleteSale = useMutation({
    mutationFn: (id: number) => remote.sales.destroy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  const handleDateFilterChange = (filter: DateFilter) => {
    const today = new Date()
    let startDate = ''
    let endDate = ''

    switch (filter) {
      case 'all':
        startDate = ''
        endDate = ''
        break

      case 'today':
        startDate = formatDate(today)
        endDate = formatDate(today)
        break

      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        startDate = formatDate(yesterday)
        endDate = formatDate(yesterday)
        break

      case 'week':
        // Week starts on Sunday by default
        const firstDayOfWeek = new Date(today)
        firstDayOfWeek.setDate(today.getDate() - today.getDay())
        startDate = formatDate(firstDayOfWeek)
        endDate = formatDate(today)
        break

      case 'month':
        const firstDayOfMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          1,
        )
        startDate = formatDate(firstDayOfMonth)
        endDate = formatDate(today)
        break

      case 'quarter':
        const currentMonth = today.getMonth()
        const firstMonthOfQuarter = currentMonth - (currentMonth % 3)
        const firstDayOfQuarter = new Date(
          today.getFullYear(),
          firstMonthOfQuarter,
          1,
        )
        startDate = formatDate(firstDayOfQuarter)
        endDate = formatDate(today)
        break

      case 'year':
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1)
        startDate = formatDate(firstDayOfYear)
        endDate = formatDate(today)
        break

      case 'day':
        const day = new Date(date)
        startDate = formatDate(day)
        endDate = formatDate(day)
        break

      case 'range':
        // keep existing custom dates, do nothing here
        return
    }

    setStartDate(startDate)
    setEndDate(endDate)
    setDateFilter(filter)
  }

  // Helper to format date as 'YYYY-MM-DD'
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setStartDate(startDate)
    setEndDate(endDate)
    if (startDate || endDate) {
      setDateFilter('range')
    }
  }

  // for date
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const changeDate = (days: number) => {
    const current = new Date(date)
    current.setDate(current.getDate() + days)
    // format as YYYY-MM-DD
    const formatted = current.toISOString().split('T')[0]
    setDate(formatted)
  }

  useEffect(() => {
    handleDateFilterChange('day')
    console.log(date, startDate, endDate)
  }, [date])
  return {
    sales,
    search,
    setSearch,
    isLoading,
    isError,
    dateFilter,
    customStartDate: startDate,
    customEndDate: endDate,
    handleDateFilterChange,
    handleCustomDateChange,

    // for sale delete confimation dialog
    deleteSale: deleteSale.mutate,
    confirmOpen,
    setConfirmOpen,
    saleToDelete,
    setSaleToDelete,

    // for updating sale
    updateSale: updateSale.mutate,

    // for date
    date,
    setDate,
    changeDate,
  }
}

export default useSalesPage
