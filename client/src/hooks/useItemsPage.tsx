import { remote } from '@/remotes/remotes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Item } from '@/models/Item'

const useItemsPage = () => {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['items'],
    queryFn: remote.items.fetchAll,
  })

  const updateItem = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Item | FormData }) =>
      remote.items.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })

  const createItem = useMutation({
    mutationFn: (data: Item) => remote.items.store(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })

  const deleteItem = useMutation({
    mutationFn: (id: number) => remote.items.destroy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['items'] }),
  })

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  )

  return {
    search,
    setSearch,
    filteredItems,
    isLoading,
    isError,
    updateItem: updateItem.mutate,
    createItem: createItem.mutate,
    deleteItem: deleteItem.mutate,
  }
}

export default useItemsPage
