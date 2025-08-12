import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog'
import CreateSaleDialog from '@/components/ui/dialogs/CreateSaleDialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useSalesPage from '@/hooks/useSalesPage'
import { Calendar, Filter, Trash2 } from 'lucide-react'

const dateFilterOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
  { value: 'custom', label: 'Custom Range' },
]

const SalesPage = () => {
  const {
    sales,
    dateFilter,
    customStartDate,
    customEndDate,
    handleDateFilterChange,
    handleCustomDateChange,

    // for sale delete confimation dialog
    deleteSale,
    confirmOpen,
    setConfirmOpen,
    saleToDelete,
    setSaleToDelete,
  } = useSalesPage()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      {/* Date Filter Controls */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filter by Date</span>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] ">
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

          {dateFilter === 'custom' && (
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

      {/* sales list  */}
      <Accordion type="single" collapsible className="w-full space-y-2">
        {sales.map((sale) => (
          <AccordionItem
            key={sale.id}
            value={`sale-${sale.id}`}
            className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 flex justify-between items-center w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-col text-left">
                  <span className="font-semibold">Sale #{sale.id}</span>
                  <div className="text-sm text-muted-foreground">
                    Total: {sale.total?.amount} {sale.total?.currency} — Profit:{' '}
                    {sale.profit?.amount} {sale.profit?.currency}
                  </div>
                </div>
                <div className="flex gap-2">
                  {sale.items.map((item) => (
                    <Badge key={item.id} variant="secondary">
                      {item.name}
                    </Badge>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSaleToDelete(sale.id)
                    setConfirmOpen(true)
                  }}
                  aria-label="Delete sale"
                  className="ml-4 text-red-500 hover:text-red-700 active:text-red-900 transition-colors duration-150">
                  <Trash2 />
                </button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-muted px-4 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Buy Price</TableHead>
                    <TableHead>Sell Price</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.buy_price?.amount} {item.buy_price?.currency}
                      </TableCell>
                      <TableCell>
                        {item.sell_price?.amount} {item.sell_price?.currency}
                      </TableCell>
                      <TableCell>
                        {(
                          (item.sell_price?.amount ?? 0) -
                          (item.buy_price?.amount ?? 0)
                        ).toFixed(2)}{' '}
                        {item.sell_price?.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <CreateSaleDialog />
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={function (): void {
          deleteSale(saleToDelete!)
        }}
        onCancel={function (): void {
          setSaleToDelete(null)
          setConfirmOpen(false)
        }}
      />
    </div>
  )
}

export default SalesPage
