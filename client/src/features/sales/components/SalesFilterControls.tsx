import { Input } from '@/components/ui/Input2'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@radix-ui/react-label'
import { Filter, Calendar } from 'lucide-react'
import SalesPageProvider, {
  useSalesPageContext,
} from '../hooks/useSalesPageContext'
import { Button } from '@/components/ui/button'

const dateFilterOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
  { value: 'day', label: 'Day' },
  { value: 'range', label: 'Custom Range' },
]

const SalesFilterControls = () => {
  const {
    dateFilter,
    customStartDate,
    customEndDate,
    handleDateFilterChange,
    handleCustomDateChange,
  } = useSalesPageContext()
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filter by Date</span>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label className="pb-1" htmlFor="date-filter">
            Date Range
          </Label>
          <Select value={dateFilter} onValueChange={handleDateFilterChange}>
            <SelectTrigger id="date-filter">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {dateFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {dateFilter === 'range' && (
          <>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={customStartDate}
                onChange={(e) =>
                  handleCustomDateChange(e.target.value, customEndDate)
                }
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={customEndDate}
                onChange={(e) =>
                  handleCustomDateChange(customStartDate, e.target.value)
                }
              />
            </div>
          </>
        )}

        {dateFilter !== 'all' && (
          <Button
            variant="outline"
            onClick={() => handleDateFilterChange('all')}
            className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Clear Filter
          </Button>
        )}
      </div>
    </div>
  )
}

export default SalesFilterControls
