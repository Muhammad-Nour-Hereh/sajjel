import useItemsPage from '@/hooks/useItemsPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SearchBar from '@/components/ui/Searchbar'
import { TextInput } from '@/components/ui/TextInput'
import { Price } from '@/models/Price'
import { PriceInput } from '@/components/ui/PriceInput'

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
                src={'http://localhost:8000/storage/' + item.thumbnail}
                alt={item.name}
                className="w-full h-48 object-cover"
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
                    data: { ...item, buy_price: new Price(amount, currency) },
                  })
                }
              />
              <PriceInput
                amount={item.sell_price?.amount || 0}
                currency={item.sell_price?.currency || 'USD'}
                onChange={({ amount, currency }) =>
                  updateItem({
                    id: item.id,
                    data: { ...item, sell_price: new Price(amount, currency) },
                  })
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ItemsPage
