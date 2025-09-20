import { http } from 'msw'
import { api } from '@/http/api'
import { Id, url } from '../utils/utils'
import { ok, noContent, fail } from '../utils/responses'
import type { Sale } from '@/types/models/Sale'
import type { SaleItem } from '@/types/models/SaleItem'
import type {
  StoreSaleRequest,
  UpdateSaleRequest,
  PatchSaleRequest,
} from '@/types/requests/saleRequests'
import type { Money } from '@/types/value-objects/Money'

// Seed from JSON
import salesSeed from '../data/sales.json'

let sales: Sale[] = (salesSeed as Sale[]) ?? []
const id = new Id(sales)

const getTodayDateTime = () => {
  const now = new Date()
  return {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0],
  }
}

const calculateSaleTotals = (
  saleItems: SaleItem[],
): { total_cost: Money; total_revenue: Money; total_profit: Money } => {
  const totalCost = saleItems.reduce(
    (sum, item) => sum + item.cost.amount * item.quantity,
    0,
  )
  const totalRevenue = saleItems.reduce(
    (sum, item) => sum + item.revenue.amount,
    0,
  )
  const totalProfit = saleItems.reduce(
    (sum, item) => sum + item.profit.amount,
    0,
  )

  return {
    total_cost: { amount: totalCost, currency: 'LBP' },
    total_revenue: { amount: totalRevenue, currency: 'LBP' },
    total_profit: { amount: totalProfit, currency: 'LBP' },
  }
}

const createSaleItem = (data: any, saleItemId: number): SaleItem => {
  const revenue: Money = {
    amount: data.price.amount * data.quantity,
    currency: data.price.currency,
  }
  const totalCost = data.cost.amount * data.quantity
  const profit: Money = {
    amount: revenue.amount - totalCost,
    currency: revenue.currency,
  }

  return {
    id: saleItemId,
    item_id: data.item_id || 0,
    name: data.name,
    model: data.model,
    note: data.note,
    quantity: data.quantity,
    cost: data.cost,
    price: data.price,
    revenue,
    profit,
  }
}

export const salesHandlers = [
  // GET /sales
  http.get(url(api.sales.index), async () => {
    return ok<Sale[]>(sales)
  }),

  // POST /sales
  http.post(url(api.sales.store), async ({ request }) => {
    const body = (await request.json()) as StoreSaleRequest
    const { date, time } = body.sold_at
      ? {
          date: body.sold_at.split('T')[0],
          time: body.sold_at.split('T')[1]?.split('.')[0] || '00:00:00',
        }
      : getTodayDateTime()

    const saleId = id.nextId()
    let nextSaleItemId = 1

    // Create sale items
    const saleItems: SaleItem[] = body.saleItems.map((itemData) =>
      createSaleItem(itemData, nextSaleItemId++),
    )

    // Calculate totals
    const totals = calculateSaleTotals(saleItems)

    const sale: Sale = {
      id: saleId,
      date,
      time,
      ...totals,
      saleItems,
    }

    sales.push(sale)
    return ok<Sale>(sale, 201)
  }),

  // GET /sales/:id
  http.get(url(api.sales.show), async ({ params }) => {
    const id = Number(params.id)
    const sale = sales.find((s) => s.id === id)
    if (!sale) return fail('Sale not found', 404)
    return ok<Sale>(sale)
  }),

  // PUT /sales/:id
  http.put(url(api.sales.update), async ({ request, params }) => {
    const id = Number(params.id)
    const idx = sales.findIndex((s) => s.id === id)
    if (idx === -1) return fail('Sale not found', 404)

    const body = (await request.json()) as UpdateSaleRequest

    // Update date/time if provided
    if (body.sold_at) {
      const date = body.sold_at.split('T')[0]
      const time = body.sold_at.split('T')[1]?.split('.')[0] || '00:00:00'
      sales[idx].date = date
      sales[idx].time = time
    }

    // Note: In real backend, you'd handle saleItems updates here
    // For mock, we keep it simple and just update date/time

    return ok<Sale>(sales[idx])
  }),

  // PATCH /sales/:id
  http.patch(url(api.sales.patch), async ({ request, params }) => {
    const id = Number(params.id)
    const idx = sales.findIndex((s) => s.id === id)
    if (idx === -1) return fail('Sale not found', 404)

    const updates = (await request.json()) as PatchSaleRequest

    if (updates.sold_at) {
      const date = updates.sold_at.split('T')[0]
      const time = updates.sold_at.split('T')[1]?.split('.')[0] || '00:00:00'
      sales[idx].date = date
      sales[idx].time = time
    }

    return ok<Sale>(sales[idx])
  }),

  // DELETE /sales/:id
  http.delete(url(api.sales.destroy), async ({ params }) => {
    const id = Number(params.id)
    const idx = sales.findIndex((s) => s.id === id)
    if (idx === -1) return fail('Sale not found', 404)

    sales.splice(idx, 1)
    return noContent()
  }),
]

export default salesHandlers
