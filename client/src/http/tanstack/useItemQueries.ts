import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { remote } from '../remotes'
import { StoreItemRequest } from '@/types/requests/itemRequests'
import { Item } from '@/types/models/Item'

const useItemQueries = () => {
  const queryClient = useQueryClient()
  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['items'],
    queryFn: remote.items.fetchAll,
  })

  const createItem = useMutation({
    mutationFn: (data: StoreItemRequest) => remote.items.store(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })

  const updateItem = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Item }) =>
      remote.items.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })

  const updateThumbnail = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StoreItemRequest }) =>
      remote.items.updateThumbnail(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => remote.items.destroy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })
  
  return {
    items,
    isLoading,
    isError,
    updateThumbnail: updateThumbnail.mutate,
    updateItem: updateItem.mutate,
    createItem: createItem.mutate,
    deleteItem: deleteItem.mutate,
  }
}

export default useItemQueries
