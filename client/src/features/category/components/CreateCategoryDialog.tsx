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
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
import { StoreCategoryRequest } from '@/types/requests/categoryRequests'

const CreateCategoryDialog = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const { createCategory } = useCategoryQueries()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget) as StoreCategoryRequest
    createCategory(formData)
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
            placeholder="Category name"
            required
            className="w-full border rounded p-2"
          />

          <textarea
            name="description"
            placeholder="description"
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

export default CreateCategoryDialog
