import { http } from 'msw'
import { api } from '@/http/api'
import { url } from '../utils/utils'
import { ok, noContent, fail } from '../utils/responses'
import type { SaleItem } from '@/types/models/SaleItem'
import type {
  StoreSaleItemRequest,
  UpdateSaleItemRequest,
  PatchSaleItemRequest,
  ReorderSaleItemRequest,
} from '@/types/requests/saleItemRequests'
import type { Money } from '@/types/value-objects/Money'

// Import sales data to manipulate
import salesSeed from '../data/sales.json'
import { partialMatchKey } from '@tanstack/react-query'

let sales = (salesSeed as any[]) ?? []

const nextSaleItemId = () => {
  const allSaleItems = sales.flatMap((s) => s.saleItems || [])
  return allSaleItems.length
    ? Math.max(...allSaleItems.map((i) => i.id)) + 1
    : 1
}

const calculateSaleItemTotals = (
  cost: Money,
  price: Money,
  quantity: number,
) => {
  const revenue: Money = {
    amount: price.amount * quantity,
    currency: price.currency,
  }
  const totalCost = cost.amount * quantity
  const profit: Money = {
    amount: revenue.amount - totalCost,
    currency: revenue.currency,
  }
  return { revenue, profit }
}

const recalculateSaleTotals = (sale: any) => {
  if (!sale.saleItems) return

  const totalCost = sale.saleItems.reduce(
    (sum: number, item: any) => sum + item.cost.amount * item.quantity,
    0,
  )
  const totalRevenue = sale.saleItems.reduce(
    (sum: number, item: any) => sum + item.revenue.amount,
    0,
  )
  const totalProfit = sale.saleItems.reduce(
    (sum: number, item: any) => sum + item.profit.amount,
    0,
  )

  sale.total_cost = { amount: totalCost, currency: 'LBP' }
  sale.total_revenue = { amount: totalRevenue, currency: 'LBP' }
  sale.total_profit = { amount: totalProfit, currency: 'LBP' }
}

export const saleItemsHandlers = [
  // POST /sales/:saleId/items
  http.post(
    url(api.saleItems.store(0)).replace('/0', '/:saleId'),
    async ({ request, params }) => {
      const saleId = Number(params.saleId)
      const sale = sales.find((s) => s.id === saleId)
      if (!sale) return fail('Sale not found', 404)

      const body = (await request.json()) as StoreSaleItemRequest

      if (!sale.saleItems) sale.saleItems = []

      const { revenue, profit } = calculateSaleItemTotals(
        body.cost,
        body.price,
        body.quantity,
      )

      const saleItem: SaleItem = {
        id: nextSaleItemId(),
        item_id: body.item_id || 0,
        name: body.name,
        note: body.note,
        quantity: body.quantity,
        cost: body.cost,
        price: body.price,
        revenue,
        profit,
      }

      sale.saleItems.push(saleItem)
      recalculateSaleTotals(sale)

      return ok<SaleItem>(saleItem, 201)
    },
  ),

  // PUT /sales/:saleId/items/:itemId
  http.put(
    url(api.saleItems.update(0, 0)).replace(
      '/0/items/0',
      '/:saleId/items/:itemId',
    ),
    async ({ request, params }) => {
      const saleId = Number(params.saleId)
      const itemId = Number(params.itemId)

      const sale = sales.find((s) => s.id === saleId)
      if (!sale) return fail('Sale not found', 404)

      const saleItemIdx =
        sale.saleItems?.findIndex((i: { id: number }) => i.id === itemId) ?? -1
      if (saleItemIdx === -1) return fail('Sale item not found', 404)

      const updates = (await request.json()) as UpdateSaleItemRequest
      const saleItem = sale.saleItems[saleItemIdx]

      // Update all fields
      Object.assign(saleItem, updates)

      // Recalculate totals
      const { revenue, profit } = calculateSaleItemTotals(
        saleItem.cost,
        saleItem.price,
        saleItem.quantity,
      )
      saleItem.revenue = revenue
      saleItem.profit = profit

      recalculateSaleTotals(sale)
      return ok<SaleItem>(saleItem)
    },
  ),

  // PATCH /sales/:saleId/items/:itemId
  http.patch(
    url(api.saleItems.patch(0, 0)).replace(
      '/0/items/0',
      '/:saleId/items/:itemId',
    ),
    async ({ request, params }) => {
      const saleId = Number(params.saleId)
      const itemId = Number(params.itemId)

      const sale = sales.find((s) => s.id === saleId)
      if (!sale) return fail('Sale not found', 404)

      const saleItemIdx =
        sale.saleItems?.findIndex((i: { id: number }) => i.id === itemId) ?? -1
      if (saleItemIdx === -1) return fail('Sale item not found', 404)

      const updates = (await request.json()) as PatchSaleItemRequest
      const saleItem = sale.saleItems[saleItemIdx]

      // Partial update
      Object.assign(saleItem, updates)

      // Recalculate totals if cost, price, or quantity changed
      if (updates.cost || updates.price || updates.quantity !== undefined) {
        const { revenue, profit } = calculateSaleItemTotals(
          saleItem.cost,
          saleItem.price,
          saleItem.quantity,
        )
        saleItem.revenue = revenue
        saleItem.profit = profit
      }

      recalculateSaleTotals(sale)
      return ok<SaleItem>(saleItem)
    },
  ),

  // PATCH /sales/:saleId/reorder-items
  http.patch(
    url(api.saleItems.reorder(0)).replace('/0', '/:saleId'),
    async ({ request, params }) => {
      const saleId = Number(params.saleId)
      const sale = sales.find((s) => s.id === saleId)
      if (!sale) return fail('Sale not found', 404)

      const { item_ids } = (await request.json()) as ReorderSaleItemRequest

      if (!sale.saleItems) return ok(sale.saleItems || [])

      // Reorder items based on the provided array
      const reorderedItems: SaleItem[] = []
      item_ids.forEach((itemId) => {
        const item = sale.saleItems.find((i: { id: number }) => i.id === itemId)
        if (item) reorderedItems.push(item)
      })

      sale.saleItems = reorderedItems
      return ok<SaleItem[]>(sale.saleItems)
    },
  ),

  // DELETE /sales/:saleId/items/:itemId
  http.delete(
    url(api.saleItems.destroy(0, 0)).replace(
      '/0/items/0',
      '/:saleId/items/:itemId',
    ),
    async ({ params }) => {
      console.log(params)
      const saleId = Number(params.saleId)
      const itemId = Number(params.itemId)

      const sale = sales.find((s) => s.id === saleId)
      if (!sale) return fail('Sale not found', 404)

      if (!sale.saleItems) return fail('Sale item not found', 404)

      const saleItemIdx = sale.saleItems.findIndex(
        (i: { id: number }) => i.id === itemId,
      )
      if (saleItemIdx === -1) return fail('Sale item not found', 404)

      sale.saleItems.splice(saleItemIdx, 1)
      recalculateSaleTotals(sale)

      return noContent()
    },
  ),
]

export default saleItemsHandlers
