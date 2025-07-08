import useItemsPage from '@/hooks/useItemsPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SearchBar from '@/components/ui/Searchbar'
import { EditableText } from '@/components/ui/EditableText'

const ItemsPage = () => {
  const { search, setSearch, filteredItems } = useItemsPage()

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
                  onChange={(val) => console.log('update name', val)}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <EditableText
                value={item.model || 'N/A'}
                onChange={(val) => console.log('update model', val)}
              />
              <EditableText
                value={item.buy_price?.toString() || '0'}
                onChange={(val) => console.log('update buy_price', val)}
              />
              <EditableText
                value={item.sell_price?.toString() || '0'}
                onChange={(val) => console.log('update sell_price', val)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ItemsPage
