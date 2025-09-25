import CreateSaleDialog from '@/features/sales/components/CreateSaleDialog'
import SaleResults from '../components/SaleResults'
import SalesList from '../components/SalesList'
import SalesPageHeader from '../components/SalesPageHeader'
import SalesFilterControls from '../components/SalesFilterControls'
import SaleDeletionConfirmationDialog from '../components/SaleDeletionConfirmationDialog'
import SalesPageProvider from '../hooks/useSalesPage'

const SalesPage = () => {
  return (
    <SalesPageProvider>
      <div className="p-6">
        <SalesPageHeader />
        <SalesFilterControls />
        <SalesList />
        <SaleResults />

        {/* Dialogs */}
        <CreateSaleDialog />
        <SaleDeletionConfirmationDialog />
      </div>
    </SalesPageProvider>
  )
}

export default SalesPage
