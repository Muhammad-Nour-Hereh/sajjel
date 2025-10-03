import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import StorageCard from '../components/StorageCard'
import StorageType from '@/types/value-objects/StorageType'

const InvetoryManagmentPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl text-balance font-bold mb-1">
            Storage Locations
          </h1>
          <p className="text-muted-foreground">
            Manage warehouses, shops, and inventory locations
          </p>
        </div>
        <Button size={'lg'}>
          <Plus className="mr-2" /> Add Storage
        </Button>
      </div>

      <StorageCard title={'store 1'} storageType={StorageType.SHOP} />
    </div>
  )
}

export default InvetoryManagmentPage
