import { useState } from 'react'
import InventoryNavBar from '../components/InventoryNavBar'
import InvetoryManagmentPage from './InvetoryManagmentPage'
import Dashboard from './Dashboard'

type pages = 'Dashboard' | 'Items' | 'Storages' | 'Alerts'

const InvventoryIndex = () => {
  const [page, setPage] = useState<pages>('Dashboard')
  return (
    <>
      <InventoryNavBar setPage={setPage} page={page} />

      {page === 'Storages' && <InvetoryManagmentPage />}
      {page === 'Dashboard' && <Dashboard />}
    </>
  )
}

export default InvventoryIndex
