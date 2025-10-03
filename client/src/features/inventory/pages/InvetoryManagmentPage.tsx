import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import StorageCard from '../components/StorageCard'
import StorageType from '@/types/value-objects/StorageType'
import AddStorageDialog from '../components/AddStorageDialog'
import { useState } from 'react'

const InvetoryManagmentPage = () => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    storageType: StorageType
  }>({
    name: '',
    storageType: StorageType.SHOP,
  })

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
        <Button
          size={'lg'}
          onClick={() => {
            setOpen(true)
          }}>
          <Plus className="mr-2" /> Add Storage
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StorageCard title={'store 1'} storageType={StorageType.SHOP} />
        <StorageCard title={'store 1'} storageType={StorageType.SHOP} />
        <StorageCard title={'store 1'} storageType={StorageType.SHOP} />
      </div>

      <AddStorageDialog
        open={open}
        setOpen={setOpen}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}

export default InvetoryManagmentPage
