import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import SearchBar from '@/components/ui/Searchbar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { remote } from '@/remotes/remotes'
import { Item } from '@/models/Item'
import ItemCard from '../ItemCard'
import { Sale } from '@/models/Sale'

const CreateSaleDialog = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [search, setSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState<Item[]>([])
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [prices, setPrices] = useState<Record<number, number>>({})
  const [notes, setNotes] = useState<Record<number, string>>({})

  const queryClient = useQueryClient()

  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: remote.items.fetchAll,
  })

  const createSale = useMutation({
    mutationFn: (data: Sale) => remote.sales.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      setOpen(false)
    },
  })

  const handleSelectItem = (item: Item) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
    )
  }

  const handleSaveSale = () => {
    const itemsDetails: Item[] = selectedItems.map((item) => ({
      item_id: item.id,
      name: item.name,
      quantity: quantities[item.id] || 1,
      sell_price: {
        amount: prices[item.id] ?? item.sell_price?.amount ?? 0,
        currency: 'USD',
      },
      buy_price: {
        amount: item.buy_price?.amount ?? 0,
        currency: 'USD',
      },
      notes: notes[item.id] || '',
    }))

    createSale.mutate({
      items: itemsDetails,
      id: 0,
      date: '',
      time: '',
    })
  }

  const totals = useMemo(() => {
    const totalSale = selectedItems.reduce((sum, item) => {
      const qty = quantities[item.id] || 1
      const price = prices[item.id] ?? item.sell_price?.amount ?? 0
      return sum + qty * price
    }, 0)

    // Placeholder net profit calc: price - 70% (cost assumption)
    const netProfit = totalSale * 0.3

    return {
      totalItems: selectedItems.length,
      totalSale,
      netProfit,
    }
  }, [selectedItems, quantities, prices])

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          setStep(1)
          setSelectedItems([])
          setQuantities({})
          setPrices({})
          setNotes({})
        }
      }}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Select Items for Sale' : 'Enter Sale Details'}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Search and select items you want to include in this sale.'
              : 'Fill out details for each selected item.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1"
              />
              <Select>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto">
              {items
                .filter((item) =>
                  item.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded p-3 cursor-pointer ${
                      selectedItems.find((i) => i.id === item.id)
                        ? 'border-primary bg-primary/10'
                        : ''
                    }`}
                    onClick={() => handleSelectItem(item)}>
                    <ItemCard
                      item={item}
                      updateItem={() => {}}
                      updateThumbnail={() => {}}
                    />
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} item(s) selected
              </span>
              <Button
                disabled={!selectedItems.length}
                onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded p-4 space-y-3 bg-white">
                  <h4 className="font-semibold">{item.name}</h4>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={quantities[item.id] || 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [item.id]: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full border rounded p-2"
                  />
                  <input
                    type="number"
                    placeholder="Sell Price"
                    value={prices[item.id] ?? item.sell_price?.amount ?? ''}
                    onChange={(e) =>
                      setPrices((prev) => ({
                        ...prev,
                        [item.id]: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full border rounded p-2"
                  />
                  <textarea
                    placeholder="Notes"
                    value={notes[item.id] || ''}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="w-full border rounded p-2"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            {/* Sale Summary */}
            <div className="border-t pt-4 mt-4 text-sm">
              <p>Total items: {totals.totalItems}</p>
              <p>Total sale: ${totals.totalSale.toFixed(2)}</p>
              <p>Net profit: ${totals.netProfit.toFixed(2)}</p>
            </div>

            <div className="mt-auto pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleSaveSale}
                disabled={createSale.isPending || !selectedItems.length}>
                {createSale.isPending ? 'Saving...' : 'Save Sale'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateSaleDialog
