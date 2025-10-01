import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ImageCard from '@/components/ui/ImageCard'
import SearchBar from '@/components/ui/Searchbar'
import useStack from '@/features/items/hooks/useStack'
import useCategoryQueries from '@/http/tanstack/useCategoryQueries'
// import useSaleQueries from '@/http/tanstack/useSaleQueries'
import { ArrowLeft, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

const CreateSaleDialog = () => {
  const [open, setOpen] = useState(false)
  // const { createSale, isLoading } = useSaleQueries()
  const { categories } = useCategoryQueries()
  const cateStack = useStack<number>([])
  const [step, setStep] = useState<1 | 2>(1)

  const cates = cateStack.top()
    ? (categories.find((cate) => cate.id === cateStack.top())?.children ?? [])
    : categories

  const items =
    categories.find((cate) => cate.id === cateStack.top())?.items ?? []

  useEffect(() => {
    console.log(
      categories.find((cate) => cate.id === cateStack.top()),
      cates,
    )
    console.log(items)
  })

  const [search, setSearch] = useState('')

  const reset = () => {
    cateStack.clear()
    setSearch('')
  }

  const handleAddAnonymousItem = () => {

  }

  const onOpenChange = (open: boolean) => {
    reset()
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl">
        <DialogTitle>New Sale</DialogTitle>

        {/* Filters and Add Anonymous Button */}
        <div className="flex gap-4 mb-4">
          <ArrowLeft onClick={() => cateStack.pop()} />
          <SearchBar value={search} onChange={setSearch} className="flex-1" />
          <Button
            variant="outline"
            onClick={handleAddAnonymousItem}
            className="whitespace-nowrap">
            Add Custom Item
          </Button>
        </div>
        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto">
          {cates.map((cate) => (
            <ImageCard
              key={'c' + cate.id}
              onClick={() => cateStack.push(cate.id)}
              title={cate.name}
              subTitle={cate.description}
              img={cate.thumbnail ?? ''}
            />
          ))}
        </div>
        <hr className="m-4" />
        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-auto">
          {items.map((item) => (
            <ImageCard
              key={'i' + item.id}
              onClick={() => {}}
              title={item.name}
              subTitle={item.note ?? ''}
              img={item.thumbnail ?? ''}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSaleDialog
