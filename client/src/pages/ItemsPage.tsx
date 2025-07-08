import useItemsPage from '@/hooks/useItemsPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SearchBar from '@/components/ui/Searchbar'
import { EditableText } from '@/components/ui/EditableText'
import { Price } from '@/models/Price'

const ItemsPage = () => {
  const { search, setSearch, filteredItems, updateItem } = useItemsPage()

  return (
    <div className="p-4">
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-md transition">
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <CardHeader>
              <CardTitle>
                <EditableText
                  value={item.name}
                  onChange={(val) =>
                    updateItem({ id: item.id, data: { name: val } })
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <EditableText
                value={item.model || 'N/A'}
                onChange={(val) =>
                  updateItem({ id: item.id, data: { model: val } })
                }
              />
              <EditableText
                value={item.buy_price?.amount.toString() || '0'}
                onChange={(val) => {
                  const amount = parseFloat(val) || 0
                  const price = new Price(
                    amount,
                    item.buy_price?.currency || 'USD',
                  )
                  updateItem({ id: item.id, data: { buy_price: price } })
                }}
              />

              <EditableText
                value={item.sell_price?.amount.toString() || '0'}
                onChange={(val) => {
                  const amount = parseFloat(val) || 0
                  const price = new Price(
                    amount,
                    item.sell_price?.currency || 'USD',
                  )
                  updateItem({ id: item.id, data: { sell_price: price } })
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ItemsPage
