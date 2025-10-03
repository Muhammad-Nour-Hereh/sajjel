import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import StorageType from '@/types/value-objects/StorageType'
import { Warehouse, Store, Package2, Edit, Trash2 } from 'lucide-react'

const storageTypeIcons = {
  warehouse: {
    icon: Warehouse,
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  shop: {
    icon: Store,
    color: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  inventory: {
    icon: Package2,
    color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  },
}

interface StorageCardProps {
  title: string
  storageType: StorageType
}

const StorageCard = ({ title, storageType }: StorageCardProps) => {
  const Icon = () => {
    const Icon = storageTypeIcons[storageType].icon
    const color = storageTypeIcons[storageType].color
    return (
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className={`h-5 w-5`} />
      </div>
    )
  }

  return (
    <Card className="max-w-200 px-4">
      <div className="flex items-center gap-4">
        <Icon />
        <div>
          <span className="text-2xl font-bold">{title}</span>
          <div>
            <Badge variant="secondary" className="mt-1 capitalize">
              {storageType}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button className="flex-auto" variant={'outline'} size="sm">
          <Edit /> Edit
        </Button>
        <Button variant={'destructive'} size="sm">
          <Trash2 />
        </Button>
      </div>
    </Card>
  )
}

export default StorageCard
