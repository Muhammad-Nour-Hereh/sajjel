import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { Sale } from '@/models/Sale'
import { SaleDetailsForm } from '../forms/SaleDetailsForm'

interface UpdateSaleDialogProps {
  sale: Sale
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (variables: { id: number; data: any }) => void
  isUpdating?: boolean
}

const UpdateSaleDialog = ({
  sale,
  open,
  onOpenChange,
  onUpdate,
  isUpdating,
}: UpdateSaleDialogProps) => {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [prices, setPrices] = useState<Record<number, number>>({})
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [totals, setTotals] = useState({
    totalItems: 0,
    totalSale: 0,
    netProfit: 0,
  })

  // Populate fields when dialog opens with existing sale data
  useEffect(() => {
    if (sale) {
      const q: Record<number, number> = {}
      const p: Record<number, number> = {}
      const n: Record<number, string> = {}

      sale.items.forEach((item) => {
        q[item.id] = item.quantity
        p[item.id] = item.price?.amount ?? 0
        n[item.id] = item.note ?? ''
      })

      setQuantities(q)
      setPrices(p)
      setNotes(n)
      // TODO: also calculate totals here if needed
    }
  }, [sale])

  const handleSave = () => {
    if (!sale) return
    const updatedData = {
      items: sale.items.map((item) => ({
        item_id: item.id,
        quantity: quantities[item.id] || 1,
        price: {
          amount: prices[item.id] ?? 0,
          currency: 'USD',
        },
        cost: {
          amount: item.cost?.amount ?? 0,
          currency: 'USD',
        },
        notes: notes[item.id] || '',
      })),
    }
    onUpdate({ id: sale.id, data: updatedData })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Sale #{sale?.id}</DialogTitle>
        </DialogHeader>

        {sale && (
          <SaleDetailsForm
            selectedItems={sale.items}
            quantities={quantities}
            prices={prices}
            notes={notes}
            totals={totals}
            isSaving={isUpdating}
            onQuantityChange={(id, val) =>
              setQuantities((prev) => ({ ...prev, [id]: val }))
            }
            onPriceChange={(id, val) =>
              setPrices((prev) => ({ ...prev, [id]: val }))
            }
            onNoteChange={(id, val) =>
              setNotes((prev) => ({ ...prev, [id]: val }))
            }
            onBack={() => onOpenChange(false)}
            onSave={handleSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UpdateSaleDialog
