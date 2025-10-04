import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import StorageCard from '../components/StorageCard'
import StorageType from '@/types/value-objects/StorageType'
import StorageDialog from '../components/StorageDialog'
import { useState } from 'react'

const storages = [
  {
    name: 'store 1',
    storageType: StorageType.SHOP,
  },
  {
    name: 'store 2',
    storageType: StorageType.INVENTORY,
  },
  {
    name: 'store 3',
    storageType: StorageType.WAREHOUSE,
  },
]

const InvetoryManagmentPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const openDialog = (mode: 'add' | 'edit') => {
    setDialogOpen(true)
    setDialogMode(mode)
  }

  const [formData, setFormData] = useState({
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
        <Button size={'lg'} onClick={() => openDialog('add')}>
          <Plus className="mr-2" /> Add Storage
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {storages.map((s) => (
          <StorageCard
            name={s.name}
            storageType={s.storageType}
            openDialog={() => openDialog('edit')}
            setFormData={setFormData}
          />
        ))}
      </div>

      <StorageDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        mode={dialogMode}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}

export default InvetoryManagmentPage
