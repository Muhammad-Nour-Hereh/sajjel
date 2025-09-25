import { useMutation, useQueryClient } from '@tanstack/react-query'
import { remote } from '../remotes'
import {
  PatchSaleItemRequest,
  ReorderSaleItemRequest,
  StoreSaleItemRequest,
  UpdateSaleItemRequest,
} from '@/types/requests/saleItemRequests'

const useSaleItemQueries = () => {
  const queryClient = useQueryClient()

  const createSaleItem = useMutation({
    mutationFn: ({
      saleId,
      data,
    }: {
      saleId: number
      data: StoreSaleItemRequest
    }) => remote.saleItems.store(saleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales', variables.saleId] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })

  const updateSaleItem = useMutation({
    mutationFn: ({
      saleId,
      itemId,
      data,
    }: {
      saleId: number
      itemId: number
      data: UpdateSaleItemRequest
    }) => remote.saleItems.update(saleId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales', variables.saleId] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })

  const patchSaleItem = useMutation({
    mutationFn: ({
      saleId,
      itemId,
      data,
    }: {
      saleId: number
      itemId: number
      data: PatchSaleItemRequest
    }) => remote.saleItems.patch(saleId, itemId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales', variables.saleId] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })

  const reorderSaleItems = useMutation({
    mutationFn: ({
      saleId,
      data,
    }: {
      saleId: number
      data: ReorderSaleItemRequest
    }) => remote.saleItems.reorder(saleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales', variables.saleId] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })

  const deleteSaleItem = useMutation({
    mutationFn: ({ saleId, itemId }: { saleId: number; itemId: number }) =>
      remote.saleItems.destroy(saleId, itemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales', variables.saleId] })
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })

  return {
    createSaleItem: createSaleItem.mutate,
    updateSaleItem: updateSaleItem.mutate,
    patchSaleItem: patchSaleItem.mutate,
    reorderSaleItems: reorderSaleItems.mutate,
    deleteSaleItem: deleteSaleItem.mutate,
    isCreating: createSaleItem.isPending,
    isUpdating: updateSaleItem.isPending,
    isPatching: patchSaleItem.isPending,
    isReordering: reorderSaleItems.isPending,
    isDeleting: deleteSaleItem.isPending,
  }
}

export default useSaleItemQueries
