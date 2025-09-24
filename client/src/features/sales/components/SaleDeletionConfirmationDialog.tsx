import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog'
import useSalesPage from '../hooks/useSalesPage'

const SaleDeletionConfirmationDialog = () => {
  const {
    deleteSale,
    confirmOpen,
    setConfirmOpen,
    saleToDelete,
    setSaleToDelete,
  } = useSalesPage()

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
