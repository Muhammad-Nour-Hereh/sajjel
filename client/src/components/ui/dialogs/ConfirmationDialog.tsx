import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmationDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

const ConfirmationDialog = ({
  open,
  onConfirm,
  onCancel,
  onOpenChange,
  title = 'Confirm Deletion',
  description = 'Are you sure you want to delete this item? This action cannot be undone.',
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              onCancel()
              onOpenChange(false)
            }}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
