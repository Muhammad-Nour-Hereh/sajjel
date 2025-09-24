import CreateSaleDialog from '@/features/sales/components/CreateSaleDialog'
import SaleResults from '../components/SaleResults'
import SalesList from '../components/SalesList'
import SalesPageHeader from '../components/SalesPageHeader'
import SalesFilterControls from '../components/SalesFilterControls'
import SaleDeletionConfirmationDialog from '../components/SaleDeletionConfirmationDialog'

const SalesPage = () => {
  return (
    <div className="p-6">
      <SalesPageHeader />
      <SalesFilterControls />
      <SalesList />
      <SaleResults />

      {/* Dialogs */}
      <CreateSaleDialog />
      <SaleDeletionConfirmationDialog />
    </div>
  )
}

export default SalesPage
