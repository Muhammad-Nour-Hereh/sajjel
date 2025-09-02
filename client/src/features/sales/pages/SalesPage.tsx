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
import { PriceInput } from '@/components/ui/PriceInput'
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
import { TextInput } from '@/components/ui/TextInput'
import useSalesPage from '@/features/sales/hooks/useSalesPage'
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  Calendar,
  Filter,
  Trash2,
} from 'lucide-react'

const dateFilterOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
  { value: 'day', label: 'day' },
  { value: 'range', label: 'Custom Range' },
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

    // for updating sale
    updateSale,

    // for date
    date,
    setDate,
    changeDate,
  } = useSalesPage()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      {/* date of the day */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <ArrowLeftCircle
              className="cursor-pointer"
              onClick={() => changeDate(-1)}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
            <ArrowRightCircle
              className="cursor-pointer"
              onClick={() => changeDate(1)}
            />
          </div>
          <span className="font-semibold text-2xl">
            بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
          </span>
          <div className="grid gap-1">
            <span>
              open time: <input type="time" defaultValue="11:11" />
            </span>
            <span>
              close time: <input type="time" defaultValue="11:11" />
            </span>
          </div>
        </div>
      </div>
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
                  {/* <span className="font-semibold">Sale #{sale.id}</span> */}
                  <span className="font-semibold">
                    {sale.date} - {sale.time}
                  </span>
                  <div className="text-sm text-muted-foreground">
                    {`Total Cost: ${sale.total_cost?.amount} ${sale.total_cost?.currency} — `}
                    {`Total Revenue: ${sale.total_revenue?.amount} ${sale.total_revenue?.currency} — `}
                    {`Total Profit: ${sale.total_profit?.amount} ${sale.total_profit?.currency}`}
                  </div>
                </div>
                <div className="flex gap-2">
                  {sale.saleItems.map((item) => (
                    <Badge key={item.item_id} variant="secondary">
                      {item.name}
                    </Badge>
                  ))}
                </div>
                <div className="flex">
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setSaleToDelete(sale.id)
                      setConfirmOpen(true)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation()
                        setSaleToDelete(sale.id)
                        setConfirmOpen(true)
                      }
                    }}
                    aria-label="Delete sale"
                    className="ml-4 text-red-500 hover:text-red-700 active:text-red-900 transition-colors duration-150 cursor-pointer">
                    <Trash2 />
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-muted px-4 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Buy Price each</TableHead>
                    <TableHead>Sell Price total</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.saleItems.map((saleItem) => (
                    <TableRow className="" key={saleItem.id}>
                      <TableCell>{saleItem.name}</TableCell>
                      <TableCell>
                        <PriceInput
                          amount={saleItem.cost?.amount || 0}
                          currency={saleItem.cost?.currency || 'USD'}
                          onChange={(val) =>
                            updateSale({
                              id: sale.id,
                              data: {
                                ...sale,
                                saleItems: sale.saleItems.map((i) =>
                                  i.item_id === saleItem.item_id
                                    ? { ...i, cost: val }
                                    : i,
                                ),
                              },
                            })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <PriceInput
                          amount={saleItem.price?.amount || 0}
                          currency={saleItem.price?.currency || ' '}
                          onChange={function (): void {
                            throw new Error('Function not implemented.')
                          }}
                        />
                      </TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>
                        {(
                          (saleItem.price?.amount ?? 0) -
                          (saleItem.cost?.amount ?? 0)
                        ).toFixed(2)}{' '}
                        {saleItem.price?.currency}
                      </TableCell>
                      <TableCell>
                        <TextInput
                          value={'note'}
                          onChange={function (): void {
                            throw new Error('Function not implemented.')
                          }}
                        />
                      </TableCell>
                      <TableCell className="flex justify-end mr-6">
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            setSaleToDelete(sale.id)
                            setConfirmOpen(true)
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation()
                              setSaleToDelete(sale.id)
                              setConfirmOpen(true)
                            }
                          }}
                          aria-label="Delete sale"
                          className="text-red-500 hover:text-red-700 active:text-red-900 transition-colors duration-150 cursor-pointer">
                          <Trash2 />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {/* dialogs  */}
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
