import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { remote } from '@/http/remotes'
import {
  StoreCategoryRequest,
  PatchCategoryRequest,
} from '@/types/requests/categoryRequests'

const useCategoryQueries = () => {
  const queryClient = useQueryClient()

  // Fetch all categories
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: remote.category.index,
  })

  // Create new category
  const createCategory = useMutation({
    mutationFn: (data: StoreCategoryRequest) => remote.category.store(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Patch category
  const patchCategory = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchCategoryRequest }) =>
      remote.category.patch(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Update thumbnail
  const updateThumbnail = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      remote.category.updateThumbnail(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: (id: number) => remote.category.destroy(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Add item to category
  const addItem = useMutation({
    mutationFn: ({
      categoryId,
      itemId,
    }: {
      categoryId: number
      itemId: number
    }) => remote.category.addItem(categoryId, itemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Remove item from category
  const removeItem = useMutation({
    mutationFn: ({
      categoryId,
      itemId,
    }: {
      categoryId: number
      itemId: number
    }) => remote.category.removeItem(categoryId, itemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Add subcategory
  const addSubcategory = useMutation({
    mutationFn: ({
      parentId,
      childId,
    }: {
      parentId: number
      childId: number
    }) => remote.category.addSubcategory(parentId, childId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  // Remove subcategory
  const removeSubcategory = useMutation({
    mutationFn: ({
      parentId,
      childId,
    }: {
      parentId: number
      childId: number
    }) => remote.category.removeSubcategory(parentId, childId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })

  return {
    categories,
    isLoading,
    isError,
    createCategory: createCategory.mutate,
    patchCategory: patchCategory.mutate,
    updateThumbnail: updateThumbnail.mutate,
    deleteCategory: deleteCategory.mutate,
    addItem: addItem.mutate,
    removeItem: removeItem.mutate,
    addSubcategory: addSubcategory.mutate,
    removeSubcategory: removeSubcategory.mutate,
  }
}

export default useCategoryQueries
