import { Button } from '@/components/ui/button'
import { Item } from '@/models/Item'

interface SaleDetailsFormProps {
  selectedItems: Item[]
  quantities: Record<number, number>
  prices: Record<number, number>
  notes: Record<number, string>
  totals: { totalItems: number; totalSale: number; netProfit: number }
  isSaving?: boolean

  onQuantityChange: (itemId: number, value: number) => void
  onPriceChange: (itemId: number, value: number) => void
  onNoteChange: (itemId: number, value: string) => void

  onBack: () => void
  onSave: () => void
}

export const SaleDetailsForm = ({
  selectedItems,
  quantities,
  prices,
  totals,
  isSaving,
  onQuantityChange,
  onPriceChange,
  onBack,
  onSave,
}: SaleDetailsFormProps) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-auto space-y-4">
        {selectedItems.map((item) => (
          <div key={item.id} className="border rounded p-4 space-y-3 bg-white">
            <h4 className="font-semibold">{item.name}</h4>

            <input
              type="number"
              placeholder="Quantity"
              value={quantities[item.id] || 1}
              onChange={(e) =>
                onQuantityChange(item.id, parseInt(e.target.value) || 1)
              }
              className="w-full border rounded p-2"
            />

            <input
              type="number"
              placeholder="Sell Price"
              value={prices[item.id] ?? item.sell_price?.amount ?? ''}
              onChange={(e) =>
                onPriceChange(item.id, parseFloat(e.target.value) || 0)
              }
              className="w-full border rounded p-2"
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
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSave} disabled={isSaving || !selectedItems.length}>
          {isSaving ? 'Saving...' : 'Save Sale'}
        </Button>
      </div>
    </div>
  )
}
