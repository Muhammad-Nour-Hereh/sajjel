import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog'
import { useSalesPageContext } from '../hooks/useSalesPageContext'
import useSaleQueries from '@/http/tanstack/useSaleQueries'
import useSaleItemQueries from '@/http/tanstack/useSaleItemQueries'

const SaleDeletionConfirmationDialog = () => {
  const {
    confirmOpen,
    setConfirmOpen,
    saleToDelete,
    setSaleToDelete,
    saleItemToDelete,
    setSaleItemToDelete,
  } = useSalesPageContext()

  const { deleteSale } = useSaleQueries()
  const { deleteSaleItem } = useSaleItemQueries()

  return (
    <ConfirmationDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      onConfirm={() => {
        if (saleToDelete) {
          deleteSale(saleToDelete)
          setSaleToDelete(null)
          setConfirmOpen(false)
        } else if (saleItemToDelete) {
          console.log(saleItemToDelete)
          deleteSaleItem(saleItemToDelete)
          setSaleItemToDelete(null)
          setConfirmOpen(false)
        }
      }}
      onCancel={() => {
        setSaleToDelete(null)
        setSaleItemToDelete(null)
        setConfirmOpen(false)
      }}
    />
  )
}

export default SaleDeletionConfirmationDialog
