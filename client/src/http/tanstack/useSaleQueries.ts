// hooks/useSaleQueries.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { remote } from '../remotes'
import {
  StoreSaleRequest,
  UpdateSaleRequest,
  PatchSaleRequest,
} from '@/types/requests/saleRequests'

const useSaleQueries = (start?: string, end?: string) => {
  const queryClient = useQueryClient()

  const {
    data: sales = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['sales', start, end],
    queryFn: () => remote.sales.fetchAll(start, end),
  })

  // const getSale = (id: number) =>
  //   useQuery({
  //     queryKey: ['sales', id],
  //     queryFn: () => remote.sales.show(id),
  //     enabled: !!id,
  //   })

  const createSale = useMutation({
    mutationFn: (data: StoreSaleRequest) => remote.sales.store(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  const updateSale = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSaleRequest }) =>
      remote.sales.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  const patchSale = useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchSaleRequest }) =>
      remote.sales.patch(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  const deleteSale = useMutation({
    mutationFn: (id: number) => remote.sales.destroy(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sales'] }),
  })

  return {
    sales,
    // getSale,
    isLoading,
    isError,
    createSale: createSale.mutate,
    updateSale: updateSale.mutate,
    patchSale: patchSale.mutate,
    deleteSale: deleteSale.mutate,
    isCreating: createSale.isPending,
    isUpdating: updateSale.isPending,
    isPatching: patchSale.isPending,
    isDeleting: deleteSale.isPending,
  }
}

export default useSaleQueries
