import { createContext, useContext, useEffect, useState } from 'react'

interface SalesPageContextType {
  search: string
  setSearch: (search: string) => void
  dateFilter: DateFilter
  customStartDate: string
  customEndDate: string
  handleDateFilterChange: (filter: DateFilter) => void
  handleCustomDateChange: (startDate: string, endDate: string) => void

  // for sale delete confirmation dialog
  confirmOpen: boolean
  setConfirmOpen: (open: boolean) => void
  saleToDelete: number | null
  setSaleToDelete: (id: number | null) => void
  saleItemToDelete: { saleId: number; itemId: number } | null
  setSaleItemToDelete: (item: { saleId: number; itemId: number } | null) => void

  // for date
  date: string
  setDate: (date: string) => void
  changeDate: (days: number) => void
}

const SalesPageContext = createContext<SalesPageContextType | undefined>(
  undefined,
)

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

const SalesPageProvider = ({ children }: any) => {
  const [search, setSearch] = useState('')

  // for filter
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // for confirmation dialog
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null)
  const [saleItemToDelete, setSaleItemToDelete] = useState<{
    saleId: number
    itemId: number
  } | null>(null)

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
    handleDateFilterChange('today')
  }, [])

  useEffect(() => {
    handleDateFilterChange('day')
    console.log(date, startDate, endDate)
  }, [date])
  const contextValue: SalesPageContextType = {
    search,
    setSearch,
    dateFilter,
    customStartDate: startDate,
    customEndDate: endDate,
    handleDateFilterChange,
    handleCustomDateChange,

    // for sale delete confirmation dialog
    confirmOpen,
    setConfirmOpen,
    saleToDelete,
    setSaleToDelete,
    saleItemToDelete,
    setSaleItemToDelete,

    // for date
    date,
    setDate,
    changeDate,
  }
  return (
    <SalesPageContext.Provider value={contextValue}>
      {children}
    </SalesPageContext.Provider>
  )
}

export const useSalesPageContext = (): SalesPageContextType => {
  const context = useContext(SalesPageContext)
  if (context === undefined) {
    throw new Error(
      'useSalesPageContext must be used within a SalesPageProvider',
    )
  }
  return context
}

export default SalesPageProvider
