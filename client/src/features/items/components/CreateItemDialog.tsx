import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'

interface Props {
  createItem: Function
}

const CreateItemDialog = ({ createItem }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    createItem(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 p-0 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill the fields to create a new item in your inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Item name"
            required
            className="w-full border rounded p-2"
          />

          <input
            type="text"
            name="model"
            placeholder="Model"
            className="w-full border rounded p-2"
          />

          <div className="flex gap-2">
            <input
              type="number"
              name="cost[amount]"
              placeholder="Buy price"
              min="0"
              step="0.01"
              className="w-full border rounded p-2"
            />
            <select
              name="cost[currency]"
              className="border rounded p-2"
              defaultValue="USD">
              <option value="USD">USD</option>
              <option value="LBP">LBP</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              name="price[amount]"
              placeholder="Sell price"
              min="0"
              step="0.01"
              className="w-full border rounded p-2"
            />
            <select
              name="price[currency]"
              className="border rounded p-2"
              defaultValue="USD">
              <option value="USD">USD</option>
              <option value="LBP">LBP</option>
            </select>
          </div>

          <textarea
            name="note"
            placeholder="Note"
            className="w-full border rounded p-2"
            rows={3}
          />

          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            ref={fileInputRef}
            className="w-full border rounded p-2"
          />

          <div className="flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateItemDialog
