import { remote } from '@/remotes/remotes'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Sale } from '@/models/Sale'

const useSalesPage = () => {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  // Fetch all sales
  const {
    data: sales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sales'],
    queryFn: remote.sales.fetchAll,
  })

  // Create sale
  const createSale = useMutation({
    mutationFn: (data: Partial<Sale>) => remote.sales.store(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  // Update sale
  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Sale> }) =>
      remote.sales.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  // Delete sale
  const deleteSale = useMutation({
    mutationFn: (id: number) => remote.sales.destroy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })


  return {
    sales,
    search,
    setSearch,
    isLoading,
    isError,
    createSale: createSale.mutate,
    updateSale: updateSale.mutate,
    deleteSale: deleteSale.mutate,
  }
}

export default useSalesPage
