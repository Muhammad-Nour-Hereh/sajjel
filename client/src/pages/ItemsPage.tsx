import useItemsPage from '@/hooks/useItemsPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SearchBar from '@/components/ui/Searchbar'

const ItemsPage = () => {
  const { search, setSearch, filteredItems } = useItemsPage()

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
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
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Model: {item.model || 'N/A'}</p>
              <p>Buy: {item.buy_price?.toString()}</p>
              <p>Sell: {item.sell_price?.toString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ItemsPage
