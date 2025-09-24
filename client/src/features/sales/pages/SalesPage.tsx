import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog'
import CreateSaleDialog from '@/features/sales/components/CreateSaleDialog'
import SaleResults from '../components/SaleResults'
import SalesList from '../components/SalesList'
import SalesPageHeader from '../components/SalesPageHeader'
import SalesFilterControls from '../components/SalesFilterControls'
import useSalesPage from '../hooks/useSalesPage'

const SalesPage = () => {
  const {
    // for sale delete confirmation dialog
    deleteSale,
    confirmOpen,
    setConfirmOpen,
    saleToDelete,
    setSaleToDelete,
  } = useSalesPage()

  return (
    <div className="p-6">
      <SalesPageHeader />
      <SalesFilterControls />
      <SalesList />
      <SaleResults />
      {/* Dialogs */}
      <CreateSaleDialog />
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
    </div>
  )
}

export default SalesPage
