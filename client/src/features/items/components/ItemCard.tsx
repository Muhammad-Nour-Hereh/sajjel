import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import EditImage from '@/components/ui/EditImage'
import { PriceInput } from '@/components/ui/PriceInput'
import { TextInput } from '@/components/ui/TextInput'
import { Item } from '@/types/models/Item'
import { getImageUrl } from '@/utils/imageUrl'

interface props {
  item: Item
  editable?: boolean
  updateItem: Function
  updateThumbnail: Function
}

const ItemCard = ({
  item,
  editable = true,
  updateItem,
  updateThumbnail,
}: props) => {
  const privilege = 1

  return (
    <Card key={item.id} className="overflow-hidden hover:shadow-md transition">
      {item.thumbnail && (
        <EditImage
          src={getImageUrl(item.thumbnail)}
          alt={item.name}
          editable={editable}
          onChange={async (file: File) => {
            const formData = new FormData()
            formData.append('thumbnail', file)
            updateThumbnail({
              id: item.id,
              data: formData,
            })
          }}
        />
      )}
      <CardHeader>
        <CardTitle>
          <TextInput
            value={item.name}
            onChange={(val) =>
              updateItem({ id: item.id, data: { ...item, name: val } })
            }
            editable={editable}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <TextInput
          value={item.model || 'N/A'}
          onChange={(val) =>
            updateItem({ id: item.id, data: { ...item, model: val } })
          }
          editable={editable}
        />
        {privilege >= 2 && (
          <PriceInput
            amount={item.cost?.amount || 0}
            currency={item.cost?.currency || 'USD'}
            editable={editable}
            onChange={({ amount, currency }) =>
              updateItem({
                id: item.id,
                data: { ...item, cost: { amount, currency } },
              })
            }
          />
        )}
        <PriceInput
          amount={item.price?.amount || 0}
          currency={item.price?.currency || 'USD'}
          editable={editable}
          onChange={({ amount, currency }) =>
            updateItem({
              id: item.id,
              data: { ...item, price: { amount, currency } },
            })
          }
        />
      </CardContent>
    </Card>
  )
}

export default ItemCard
