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

interface AddStorageDialogProps {
  formData: {
    name: string
    storageType: StorageType
  }
  setFormData: (formData: { name: string; storageType: StorageType }) => void
  open: boolean
  setOpen: (val: boolean) => void
}

const AddStorageDialog = ({
  open,
  setOpen,
  formData,
  setFormData,
}: AddStorageDialogProps) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Storage Location</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new storage location
        </DialogDescription>
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
        <Button>Add Storage</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default AddStorageDialog
