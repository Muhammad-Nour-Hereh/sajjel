import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const sales = [
  {
    id: 1,
    total_amount: 300,
    total_currency: 'USD',
    profit_amount: 50,
    profit_currency: 'USD',
    items: [
      {
        item_id: 1,
        name: 'iPhone 13',
        buy_price_amount: 100,
        buy_price_currency: 'USD',
        sell_price_amount: 150,
        sell_price_currency: 'USD',
      },
      {
        item_id: 2,
        name: 'Samsung S22',
        buy_price_amount: 80,
        buy_price_currency: 'USD',
        sell_price_amount: 100,
        sell_price_currency: 'USD',
      },
    ],
  },
  {
    id: 2,
    total_amount: 4000000,
    total_currency: 'LBP',
    profit_amount: 500000,
    profit_currency: 'LBP',
    items: [
      {
        item_id: 3,
        name: 'Nokia 3310',
        buy_price_amount: 500000,
        buy_price_currency: 'LBP',
        sell_price_amount: 700000,
        sell_price_currency: 'LBP',
      },
    ],
  },
  {
    id: 3,
    total_amount: 4000000,
    total_currency: 'LBP',
    profit_amount: 500000,
    profit_currency: 'LBP',
    items: [
      {
        item_id: 3,
        name: 'Nokia 3310',
        buy_price_amount: 500000,
        buy_price_currency: 'LBP',
        sell_price_amount: 700000,
        sell_price_currency: 'LBP',
      },
    ],
  },
  {
    id: 4,
    total_amount: 4000000,
    total_currency: 'LBP',
    profit_amount: 500000,
    profit_currency: 'LBP',
    items: [
      {
        item_id: 3,
        name: 'Nokia 3310',
        buy_price_amount: 500000,
        buy_price_currency: 'LBP',
        sell_price_amount: 700000,
        sell_price_currency: 'LBP',
      },
    ],
  },
]

const SalesPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sales</h1>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {sales.map((sale) => (
          <AccordionItem
            key={sale.id}
            value={`sale-${sale.id}`}
            className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 flex justify-between items-center w-full">
              <div className="flex flex-col text-left">
                <span className="font-semibold">Sale #{sale.id}</span>
                <div className="text-sm text-muted-foreground">
                  Total: {sale.total_amount} {sale.total_currency} — Profit:{' '}
                  {sale.profit_amount} {sale.profit_currency}
                </div>
              </div>
              <div className="flex gap-2">
                {sale.items.map((item) => (
                  <Badge key={item.item_id} variant="secondary">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-muted px-4 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Buy Price</TableHead>
                    <TableHead>Sell Price</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sale.items.map((item) => (
                    <TableRow key={item.item_id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.buy_price_amount} {item.buy_price_currency}
                      </TableCell>
                      <TableCell>
                        {item.sell_price_amount} {item.sell_price_currency}
                      </TableCell>
                      <TableCell>
                        {(
                          item.sell_price_amount - item.buy_price_amount
                        ).toFixed(2)}{' '}
                        {item.sell_price_currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default SalesPage
