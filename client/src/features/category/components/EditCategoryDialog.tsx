'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Folder, Package } from 'lucide-react'
import { Category } from '@/types/models/Category'
import { Item } from '@/types/models/Item'

interface EditCategoryDialogProps {
  category: Category
  patchCategory: (id: number, data: Partial<Category>) => void
  trigger?: React.ReactNode
}

const EditCategoryDialog = ({
  category,
  patchCategory,
  trigger,
}: EditCategoryDialogProps) => {
  const [open, setOpen] = useState(false)
  const [categoryData, setCategoryData] = useState({
    name: category.name,
    description: category.description,
    thumbnail: category.thumbnail || '',
  })

  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(),
  )

  // Mock available items and categories for selection
  const availableItems: Item[] = [
    {
      id: 101,
      name: 'Sample Item 1',
      model: 'M001',
      thumbnail: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 102,
      name: 'Sample Item 2',
      model: 'M002',
      thumbnail: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 103,
      name: 'Sample Item 3',
      model: 'M003',
      thumbnail: '/placeholder.svg?height=40&width=40',
    },
  ]

  const availableCategories: Category[] = [
    {
      id: 201,
      name: 'Subcategory A',
      description: 'Description A',
      thumbnail: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 202,
      name: 'Subcategory B',
      description: 'Description B',
      thumbnail: '/placeholder.svg?height=40&width=40',
    },
    {
      id: 203,
      name: 'Subcategory C',
      description: 'Description C',
      thumbnail: '/placeholder.svg?height=40&width=40',
    },
  ]

  const handleSave = () => {
    const updatedCategory = {
      ...categoryData,
      children: availableCategories.filter((cat) =>
        selectedCategories.has(cat.id),
      ),
      items: availableItems.filter((item) => selectedItems.has(item.id)),
    }

    patchCategory(category.id, updatedCategory)
    setOpen(false)
  }

  const toggleItemSelection = (itemId: number) => {
    const newSelection = new Set(selectedItems)
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId)
    } else {
      newSelection.add(itemId)
    }
    setSelectedItems(newSelection)
  }

  const toggleCategorySelection = (categoryId: number) => {
    const newSelection = new Set(selectedCategories)
    if (newSelection.has(categoryId)) {
      newSelection.delete(categoryId)
    } else {
      newSelection.add(categoryId)
    }
    setSelectedCategories(newSelection)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="ghost" className="h-6 px-2">
            <Edit className="h-3 w-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Category: {category.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={categoryData.name}
                  onChange={(e) =>
                    setCategoryData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={categoryData.description}
                  onChange={(e: { target: { value: any } }) =>
                    setCategoryData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={categoryData.thumbnail}
                  onChange={(e) =>
                    setCategoryData((prev) => ({
                      ...prev,
                      thumbnail: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subcategories" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Subcategories</h3>
              <Badge variant="secondary">
                {selectedCategories.size} selected
              </Badge>
            </div>
            <div className="grid gap-3">
              {availableCategories.map((cat) => (
                <Card
                  key={cat.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCategories.has(cat.id)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleCategorySelection(cat.id)}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {cat.thumbnail ? (
                          <img
                            src={cat.thumbnail || '/placeholder.svg'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Folder className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{cat.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                      {selectedCategories.has(cat.id) && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Select Items</h3>
              <Badge variant="secondary">{selectedItems.size} selected</Badge>
            </div>
            <div className="grid gap-3">
              {availableItems.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-colors ${
                    selectedItems.has(item.id)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => toggleItemSelection(item.id)}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail || '/placeholder.svg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        {item.model && (
                          <p className="text-xs text-muted-foreground">
                            Model: {item.model}
                          </p>
                        )}
                      </div>
                      {selectedItems.has(item.id) && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditCategoryDialog
