import { Card, CardContent, CardHeader, CardTitle } from './card'
import EditImage from './EditImage'
import { TextInput } from './TextInput'
import { PriceInput } from './PriceInput'
import { Price } from '@/models/Price'
import { Item } from '@/models/Item'

interface props {
  item: Item
  updateItem: Function
  updateThumbnail: Function
}

const ItemCard = ({ item, updateItem, updateThumbnail }: props) => {
  return (
    <Card key={item.id} className="overflow-hidden hover:shadow-md transition">
      {item.thumbnail && (
        <EditImage
          src={'http://localhost:8000/storage/' + item.thumbnail}
          alt={item.name}
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
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <TextInput
          value={item.model || 'N/A'}
          onChange={(val) =>
            updateItem({ id: item.id, data: { ...item, model: val } })
          }
        />
        <PriceInput
          amount={item.buy_price?.amount || 0}
          currency={item.buy_price?.currency || 'USD'}
          onChange={({ amount, currency }) =>
            updateItem({
              id: item.id,
              data: { ...item, buy_price: { amount, currency } },
            })
          }
        />
        <PriceInput
          amount={item.sell_price?.amount || 0}
          currency={item.sell_price?.currency || 'USD'}
          onChange={({ amount, currency }) =>
            updateItem({
              id: item.id,
              data: { ...item, sell_price: { amount, currency } },
            })
          }
        />
      </CardContent>
    </Card>
  )
}

export default ItemCard
