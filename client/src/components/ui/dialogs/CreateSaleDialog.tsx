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
import { Plus, X } from 'lucide-react'
import SearchBar from '@/components/ui/Searchbar'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { remote } from '@/remotes/remotes'
import { Item } from '@/models/Item'
import ItemCard from '../ItemCard'
import { SaleRequest } from '@/requests/saleRequests'
import { PriceInput } from '../PriceInput'
import { Money } from '@/value objects/Money'
import { Currency } from '@/value objects/Currency'

interface SaleItemData {
  id: string // temporary ID for tracking
  item_id: number | null
  name: string
  model: string
  note: string
  quantity: number
  cost: Money
  price: Money
}

const CreateSaleDialog = () => {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [search, setSearch] = useState('')
  const [saleItems, setSaleItems] = useState<SaleItemData[]>([])

  const queryClient = useQueryClient()

  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: remote.items.fetchAll,
  })

  const createSale = useMutation({
    mutationFn: (data: SaleRequest) => remote.sales.store(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      resetAndClose()
    },
  })

  const resetAndClose = () => {
    setOpen(false)
    setStep(1)
    setSaleItems([])
    setSearch('')
  }

  const handleSelectItem = (item: Item) => {
    // Check if item is already selected
    const existingItem = saleItems.find((si) => si.item_id === item.id)
    if (existingItem) {
      // Remove if already selected
      setSaleItems((prev) => prev.filter((si) => si.id !== existingItem.id))
    } else {
      // Add new item
      const newSaleItem: SaleItemData = {
        id: `item-${item.id}-${Date.now()}`,
        item_id: item.id,
        name: item.name,
        model: item.model || '',
        note: '',
        quantity: 1,
        cost: item.cost || { amount: 0, currency: 'USD' },
        price: item.price || { amount: 0, currency: 'USD' },
      }
      setSaleItems((prev) => [...prev, newSaleItem])
    }
  }

  const handleAddAnonymousItem = () => {
    const newSaleItem: SaleItemData = {
      id: `anonymous-${Date.now()}`,
      item_id: null,
      name: '',
      model: '',
      note: '',
      quantity: 1,
      cost: { amount: 0, currency: 'USD' },
      price: { amount: 0, currency: 'USD' },
    }
    setSaleItems((prev) => [...prev, newSaleItem])
  }

  const updateSaleItem = (id: string, updates: Partial<SaleItemData>) => {
    setSaleItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }

  const removeSaleItem = (id: string) => {
    setSaleItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSaveSale = () => {
    // Validate that all items have required fields
    const validItems = saleItems.filter(
      (item) => item.name.trim() && item.quantity > 0 && item.price.amount > 0,
    )

    if (validItems.length === 0) return

    const saleData: SaleRequest = {
      saleItems: validItems.map((item) => ({
        item_id: item.item_id,
        name: item.name,
        model: item.model || undefined,
        note: item.note || undefined,
        quantity: item.quantity,
        cost: item.cost,
        price: item.price,
      })),
    }

    createSale.mutate(saleData)
  }

  const totals = useMemo(() => {
    const totalSale = saleItems.reduce((sum, item) => {
      return sum + item.quantity * item.price.amount
    }, 0)

    const totalCost = saleItems.reduce((sum, item) => {
      return sum + item.quantity * item.cost.amount
    }, 0)

    const netProfit = totalSale - totalCost

    return {
      totalItems: saleItems.length,
      totalSale,
      totalCost,
      netProfit,
    }
  }, [saleItems])

  const isItemSelected = (item: Item) => {
    return saleItems.some((si) => si.item_id === item.id)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[800px] w-full h-[90vh] flex flex-col"
        onInteractOutside={resetAndClose}
        onEscapeKeyDown={resetAndClose}>
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Select Items for Sale' : 'Enter Sale Details'}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? 'Search and select items or add custom items for this sale.'
              : 'Fill out details for each item in the sale.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Filters and Add Anonymous Button */}
            <div className="flex gap-4 mb-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleAddAnonymousItem}
                className="whitespace-nowrap">
                Add Custom Item
              </Button>
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
                    className={`rounded p-3 cursor-pointer border ${
                      isItemSelected(item)
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSelectItem(item)}>
                    <ItemCard
                      item={item}
                      updateItem={() => {}}
                      updateThumbnail={() => {}}
                      editable={false}
                    />
                  </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {saleItems.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button disabled={!saleItems.length} onClick={() => setStep(2)}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-auto space-y-4">
              {saleItems.map((saleItem) => (
                <div
                  key={saleItem.id}
                  className="border rounded p-4 space-y-3 bg-white relative">
                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeSaleItem(saleItem.id)}>
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="pr-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-sm font-medium">Name *</label>
                        <input
                          type="text"
                          placeholder="Item name"
                          value={saleItem.name}
                          onChange={(e) =>
                            updateSaleItem(saleItem.id, {
                              name: e.target.value,
                            })
                          }
                          className="w-full border rounded p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Model</label>
                        <input
                          type="text"
                          placeholder="Item model"
                          value={saleItem.model}
                          onChange={(e) =>
                            updateSaleItem(saleItem.id, {
                              model: e.target.value,
                            })
                          }
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="text-sm font-medium">Note</label>
                      <textarea
                        placeholder="Special note for this sale item"
                        value={saleItem.note}
                        onChange={(e) =>
                          updateSaleItem(saleItem.id, { note: e.target.value })
                        }
                        className="w-full border rounded p-2 h-20 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-sm font-medium">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min={1}
                          placeholder="Quantity"
                          value={saleItem.quantity}
                          onChange={(e) =>
                            updateSaleItem(saleItem.id, {
                              quantity: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded p-2"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Sell Price *
                        </label>
                        <PriceInput
                          amount={saleItem.price.amount}
                          currency={saleItem.price.currency}
                          onChange={(val: {
                            amount: number
                            currency: Currency
                          }) => {
                            updateSaleItem(saleItem.id, { price: val })
                          }}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Cost Price
                        </label>
                        <PriceInput
                          amount={saleItem.cost.amount}
                          currency={saleItem.cost.currency}
                          onChange={(val: {
                            amount: number
                            currency: Currency
                          }) => {
                            updateSaleItem(saleItem.id, { cost: val })
                          }}
                        />
                      </div>
                    </div>

                    {saleItem.item_id && (
                      <div className="text-xs text-gray-500 mt-2">
                        Linked to item ID: {saleItem.item_id}
                      </div>
                    )}
                    {!saleItem.item_id && (
                      <div className="text-xs text-blue-600 mt-2">
                        Custom item (not in inventory)
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {saleItems.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No items selected. Go back to add items.
                </div>
              )}
            </div>

            {/* Sale Summary */}
            {saleItems.length > 0 && (
              <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Sale Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total items:</span>
                    <span>{totals.totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total cost:</span>
                    <span>${totals.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total revenue:</span>
                    <span>${totals.totalSale.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Net profit:</span>
                    <span
                      className={
                        totals.netProfit >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }>
                      ${totals.netProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleSaveSale}
                disabled={createSale.isPending || saleItems.length === 0}>
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
