import useItemsPage from '@/hooks/useItemsPage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ItemsPage = () => {
  const { items } = useItemsPage()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition">
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
  )
}

export default ItemsPage
