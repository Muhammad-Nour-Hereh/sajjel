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
import { SaleDTO } from '@/dto models/SaleDTO'
import { Price } from '@/models/Price'
import { SaleDetailsForm } from '../forms/SaleDetailsForm'

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
    mutationFn: (data: SaleDTO) => remote.sales.store(data),
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
    const itemsDetails: SaleDTO = {
      items: selectedItems.map((item) => ({
        item_id: item.id,
        quantity: quantities[item.id] || 1,
        sell_price: new Price(
          prices[item.id] ?? item.sell_price?.amount ?? 0,
          'USD',
        ),
        buy_price: new Price(item.buy_price?.amount ?? 0, 'USD'),
      })),
    }

    createSale.mutate(itemsDetails)
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
          <SaleDetailsForm
            selectedItems={selectedItems}
            quantities={quantities}
            prices={prices}
            notes={notes}
            totals={totals}
            isSaving={createSale.isPending}
            onQuantityChange={(id, val) =>
              setQuantities((prev) => ({ ...prev, [id]: val }))
            }
            onPriceChange={(id, val) =>
              setPrices((prev) => ({ ...prev, [id]: val }))
            }
            onNoteChange={(id, val) =>
              setNotes((prev) => ({ ...prev, [id]: val }))
            }
            onBack={() => setStep(1)}
            onSave={handleSaveSale}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateSaleDialog
