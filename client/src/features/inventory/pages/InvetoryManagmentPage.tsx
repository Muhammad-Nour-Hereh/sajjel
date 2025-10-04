import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import StorageCard from '../components/StorageCard'
import StorageType from '@/types/value-objects/StorageType'
import StorageDialog from '../dialogs/StorageDialog'
import { useState } from 'react'
import ConfirmationDialog from '@/components/ui/dialogs/ConfirmationDialog'

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
  // storage dialog states
  const [storageDialogOpen, setStorageDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add')
  const openDialog = (mode: 'add' | 'edit') => {
    setStorageDialogOpen(true)
    setDialogMode(mode)
  }

  // confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  // form states
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
            setConfirmDialog={setConfirmDialogOpen}
          />
        ))}
      </div>

      {/* dialogs */}
      <StorageDialog
        open={storageDialogOpen}
        setOpen={setStorageDialogOpen}
        mode={dialogMode}
        formData={formData}
        setFormData={setFormData}
      />

      <ConfirmationDialog
        open={confirmDialogOpen}
        onConfirm={function (): void {
          throw new Error('Function not implemented.')
        }}
        onCancel={function (): void {
          throw new Error('Function not implemented.')
        }}
        onOpenChange={function (open: boolean): void {
          setConfirmDialogOpen(open)
          throw new Error('Function not implemented.')
        }}
      />
    </div>
  )
}

export default InvetoryManagmentPage
