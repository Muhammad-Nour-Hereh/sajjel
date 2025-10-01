import CreateSaleDialog from '@/features/sales/dialogs/CreateSaleDialog'
import SaleResults from '../components/SaleResults'
import SalesList from '../components/SalesList'
import SalesPageHeader from '../components/SalesPageHeader'
import SalesFilterControls from '../components/SalesFilterControls'
import SaleDeletionConfirmationDialog from '../dialogs/SaleDeletionConfirmationDialog'
import SalesPageProvider from '../hooks/useSalesPageContext'

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
