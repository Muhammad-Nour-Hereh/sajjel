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
import useSalesPage from '@/hooks/useSalesPage'

const SalesPage = () => {
  const { sales } = useSalesPage()

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
                  Total: {sale.total?.amount} {sale.total?.currency} — Profit:{' '}
                  {sale.profit?.amount} {sale.profit?.currency}
                </div>
              </div>
              <div className="flex gap-2">
                {sale.items.map((item) => (
                  <Badge key={item.id} variant="secondary">
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
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.buy_price?.amount} {item.buy_price?.currency}
                      </TableCell>
                      <TableCell>
                        {item.sell_price?.amount} {item.sell_price?.currency}
                      </TableCell>
                      <TableCell>
                        {(
                          (item.sell_price?.amount ?? 0) -
                          (item.buy_price?.amount ?? 0)
                        ).toFixed(2)}{' '}
                        {item.sell_price?.currency}
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
