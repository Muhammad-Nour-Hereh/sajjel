import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog'
import { useSalesPageContext } from '../hooks/useSalesPage'
import useSaleQueries from '@/http/tanstack/useSaleQueries'

const SaleDeletionConfirmationDialog = () => {
  const { confirmOpen, setConfirmOpen, saleToDelete, setSaleToDelete } =
    useSalesPageContext()

  const { deleteSale } = useSaleQueries()

  return (
    <ConfirmationDialog
      open={confirmOpen}
      onOpenChange={setConfirmOpen}
      onConfirm={() => {
        if (saleToDelete) {
          deleteSale(saleToDelete)
          setSaleToDelete(null)
          setConfirmOpen(false)
        }
      }}
      onCancel={() => {
        setSaleToDelete(null)
        setConfirmOpen(false)
      }}
    />
  )
}

export default SaleDeletionConfirmationDialog
