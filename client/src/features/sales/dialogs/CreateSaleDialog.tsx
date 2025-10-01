import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'
import ImageCard from '@/components/ui/ImageCard'
import { PriceInput } from '@/components/ui/PriceInput'
import SearchBar from '@/components/ui/Searchbar'
import useStack from '@/features/items/hooks/useStack'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import { SaleItem } from '@/types/models/SaleItem'
import { StoreSaleRequest } from '@/types/requests/saleRequests'
import { Currency } from '@/types/value-objects/Currency'
import useSaleQueries from '@/http/tanstack/useSaleQueries'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Item } from '@/types/models/Item'

const CreateSaleDialog = () => {
  const [open, setOpen] = useState(false)
  const { createSale, isLoading } = useSaleQueries()
  const { categories } = useCategoryQueries()
  const cateStack = useStack<number>([])
  const [step, setStep] = useState<1 | 2>(1)
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])

  const cates = cateStack.top()
    ? (categories.find((cate) => cate.id === cateStack.top())?.children ?? [])
    : categories

  const items =
    categories.find((cate) => cate.id === cateStack.top())?.items ?? []

  const [search, setSearch] = useState('')

  const filteredCates = useMemo(() => {
    if (!search) return cates
    return cates.filter((cate) =>
      cate.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [cates, search])

  const filteredItems = useMemo(() => {
    if (!search) return items
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [items, search])

  const reset = () => {
    cateStack.clear()
    setSearch('')
    setSaleItems([])
    setStep(1)
  }

  const handleAddAnonymousItem = () => {
    const newSaleItem: SaleItem = {
      id: -1,
      item_id: -1,
      name: '',
      model: '',
      note: '',
      quantity: 1,
      cost: { amount: 0, currency: 'USD' },
      price: { amount: 0, currency: 'USD' },
      revenue: { amount: 0, currency: 'USD' },
      profit: { amount: 0, currency: 'USD' },
    }
    setSaleItems((prev) => [...prev, newSaleItem])
    setStep(2)
  }

  const onOpenChange = (open: boolean) => {
    if (!open) reset()
    setOpen(open)
  }

  const updateSaleItem = (id: number, updates: Partial<SaleItem>) => {
    setSaleItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    )
  }

  const removeSaleItem = (id: number) => {
    setSaleItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSaveSale = () => {
    const validItems = saleItems.filter(
      (item) => item.name.trim() && item.quantity > 0 && item.price.amount > 0,
    )

    if (validItems.length === 0) return

    const saleData: StoreSaleRequest = {
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

    createSale(saleData)
    reset()
    setOpen(false)
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

  const handleSelectItem = (item: Item) => {
    const existingItem = saleItems.find((si) => si.item_id === item.id)
    if (existingItem) {
      setSaleItems((prev) => prev.filter((si) => si.id !== existingItem.id))
    } else {
      const newSaleItem: SaleItem = {
        id: Date.now(),
        item_id: item.id,
        name: item.name,
        model: item.model || '',
        note: '',
        quantity: 1,
        cost: item.cost || { amount: 0, currency: 'USD' },
        price: item.price || { amount: 0, currency: 'USD' },
        revenue: { amount: 0, currency: 'USD' },
        profit: { amount: 0, currency: 'USD' },
      }
      setSaleItems((prev) => [...prev, newSaleItem])
    }
    setStep(2)
  }

  const isItemSelected = (item: Item) => {
    return saleItems.some((si) => si.item_id === item.id)
  }

  const canGoBack = cateStack.top() !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] w-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl">
            {step === 1 ? 'Select Items for Sale' : 'Enter Sale Details'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {step === 1
              ? 'Browse categories and select items for this sale.'
              : 'Fill out details for each item in the sale.'}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="flex flex-col flex-1 overflow-hidden px-6">
            {/* Navigation and Search */}
            <div className="flex gap-3 my-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => cateStack.pop()}
                disabled={!canGoBack}
                className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <SearchBar
                value={search}
                onChange={setSearch}
                className="flex-1"
                placeholder="Search categories or items..."
              />
              <Button
                variant="outline"
                onClick={handleAddAnonymousItem}
                className="whitespace-nowrap">
                <Plus className="w-4 h-4 mr-2" />
                Custom Item
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto pb-4 space-y-6">
              {/* Categories Section */}
              {filteredCates.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">
                    Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredCates.map((cate) => (
                      <div
                        key={'c' + cate.id}
                        className="transition-transform hover:scale-[1.02]">
                        <ImageCard
                          onClick={() => {
                            cateStack.push(cate.id)
                            setSearch('')
                          }}
                          title={cate.name}
                          subTitle={cate.description}
                          img={cate.thumbnail ?? ''}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items Section */}
              {filteredItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-gray-700 uppercase tracking-wide">
                    Items
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={'i' + item.id}
                        className={`relative rounded-lg border-2 transition-all hover:scale-[1.02] ${
                          isItemSelected(item)
                            ? 'border-primary shadow-md bg-primary/5'
                            : 'border-transparent hover:border-gray-200'
                        }`}>
                        <ImageCard
                          onClick={() => handleSelectItem(item)}
                          title={item.name}
                          subTitle={item.note ?? ''}
                          img={item.thumbnail ?? ''}
                        />
                        {isItemSelected(item) && (
                          <div className="absolute top-2 right-2 bg-primary text-white rounded-full px-2 py-1 text-xs font-medium">
                            ✓ Selected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredCates.length === 0 && filteredItems.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                  <p className="text-lg">No categories or items found</p>
                  <p className="text-sm mt-2">Try adjusting your search</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="py-4 border-t flex justify-between items-center bg-white">
              <span className="text-sm font-medium text-gray-600">
                {saleItems.length} item{saleItems.length !== 1 ? 's' : ''}{' '}
                selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!saleItems.length} onClick={() => setStep(2)}>
                  Continue to Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {saleItems.map((saleItem) => (
                <div
                  key={saleItem.id}
                  className="border rounded-lg p-5 space-y-4 bg-white shadow-sm relative hover:shadow-md transition-shadow">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeSaleItem(saleItem.id)}>
                    <X className="h-5 w-5" />
                  </Button>

                  <div className="pr-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                          Name *
                        </label>
                        <input
                          type="text"
                          placeholder="Item name"
                          value={saleItem.name}
                          onChange={(e) =>
                            updateSaleItem(saleItem.id, {
                              name: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                          Model
                        </label>
                        <input
                          type="text"
                          placeholder="Item model"
                          value={saleItem.model}
                          onChange={(e) =>
                            updateSaleItem(saleItem.id, {
                              model: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                        Note
                      </label>
                      <textarea
                        placeholder="Special note for this sale item"
                        value={saleItem.note}
                        onChange={(e) =>
                          updateSaleItem(saleItem.id, { note: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md p-2.5 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
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
                          className="w-full border border-gray-300 rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
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
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
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

                    <div className="mt-3 pt-3 border-t">
                      {saleItem.item_id ? (
                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Linked to inventory item #{saleItem.item_id}
                        </div>
                      ) : (
                        <div className="text-xs text-blue-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Custom item (not in inventory)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {saleItems.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                  <p className="text-lg">No items selected</p>
                  <p className="text-sm mt-2">
                    Go back to add items to the sale
                  </p>
                </div>
              )}
            </div>

            {/* Sale Summary */}
            {saleItems.length > 0 && (
              <div className="border-t bg-gray-50 px-6 py-4">
                <h3 className="font-bold text-lg mb-3">Sale Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Total items:</span>
                    <span className="font-semibold">{totals.totalItems}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Total cost:</span>
                    <span className="font-semibold">
                      ${totals.totalCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Total revenue:</span>
                    <span className="font-semibold">
                      ${totals.totalSale.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t-2 border-gray-300 mt-2">
                    <span className="font-bold text-base">Net profit:</span>
                    <span
                      className={`font-bold text-base ${
                        totals.netProfit >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                      ${totals.netProfit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t bg-white flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSaveSale}
                disabled={isLoading || saleItems.length === 0}
                size="lg">
                {isLoading ? 'Saving...' : 'Complete Sale'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CreateSaleDialog
