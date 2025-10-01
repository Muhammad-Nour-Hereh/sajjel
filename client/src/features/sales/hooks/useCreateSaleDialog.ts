import useStack from '@/features/items/hooks/useStack'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import { SaleItem } from '@/types/models/SaleItem'
import { StoreSaleRequest } from '@/types/requests/saleRequests'
import useSaleQueries from '@/http/tanstack/useSaleQueries'
import { useMemo, useState } from 'react'
import { Item } from '@/types/models/Item'

const useCreateSaleDialog = () => {
  const { createSale, isLoading } = useSaleQueries()
  const { categories } = useCategoryQueries()
  const [open, setOpen] = useState(false)
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

  return {
    // State
    open,
    setOpen,
    step,
    setStep,
    search,
    setSearch,
    saleItems,
    setSaleItems,

    // Data
    categories,
    cates,
    items,
    filteredCates,
    filteredItems,
    totals,
    isLoading,

    // Stack operations
    cateStack,
    canGoBack,

    // Actions
    onOpenChange,
    reset,
    handleSelectItem,
    handleAddAnonymousItem,
    updateSaleItem,
    removeSaleItem,
    handleSaveSale,
    isItemSelected,
  }
}

export default useCreateSaleDialog
