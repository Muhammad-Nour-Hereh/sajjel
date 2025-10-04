import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StorageType from '@/types/value-objects/StorageType'
import { toPascalCase } from '@/utils/string-helpers'

interface StorageDialogProps {
  open: boolean
  setOpen: (val: boolean) => void
  mode: 'add' | 'edit'
  formData: {
    name: string
    storageType: StorageType
  }
  setFormData: (formData: { name: string; storageType: StorageType }) => void
}

const StorageDialog = ({
  open,
  setOpen,
  mode,
  formData,
  setFormData,
}: StorageDialogProps) => {
  const name =
    mode === 'add' ? 'Add New Storage Location' : 'Edit Storage Location'
  const desc =
    mode === 'add'
      ? 'Fill in the details to create a new storage location'
      : 'Update the storage location details below'
  const confirm = mode === 'add' ? 'Add Storage' : 'Update Storage'
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Label htmlFor="name">Storage Name</Label>
        <Input id="name" placeholder="main shop ..." value={formData.name} />
        <Label htmlFor="select">Storage Type</Label>
        <Select
          value={formData.storageType}
          onValueChange={(val: StorageType) => {
            setFormData({ ...formData, storageType: val })
          }}>
          <SelectTrigger id="select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(StorageType).map((st) => (
              <SelectItem value={st}>{toPascalCase(st)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false)
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false)
            }}>
            {confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StorageDialog
