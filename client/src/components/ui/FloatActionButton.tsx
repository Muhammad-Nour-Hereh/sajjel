import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FloatActionButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 p-0 shadow-lg">
    <Plus className="w-6 h-6" />
  </Button>
)

export default FloatActionButton
