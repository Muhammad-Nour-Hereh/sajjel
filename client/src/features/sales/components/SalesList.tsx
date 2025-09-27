import { PriceInput } from '@/components/ui/PriceInput'
import QuantityInput from '@/components/ui/QuantityInput'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import { TextInput } from '@/components/ui/TextInput'

import { useSalesPageContext } from '../hooks/useSalesPageContext'
import usePrivileges from '@/hooks/usePrivilege'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Trash2 } from 'lucide-react'
import useSaleQueries from '@/http/tanstack/useSaleQueries'
import { Sale } from '@/types/models/Sale'
import useSaleItemQueries from '@/http/tanstack/useSaleItemQueries'

const SalesList = () => {
  const { setConfirmOpen, setSaleToDelete, setSaleItemToDelete } =
    useSalesPageContext()

  const { sales } = useSaleQueries()
  const { patchSaleItem } = useSaleItemQueries()

  const { costPrivilege } = usePrivileges()

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {sales.map((sale: Sale) => (
        <AccordionItem
          key={sale.id}
          value={`sale-${sale.id}`}
          className="border rounded-lg">
          <AccordionTrigger className="px-4 py-3 flex justify-between items-center w-full">
            <div className="flex justify-between items-center w-full">
              <div className="flex flex-col text-left">
                <span className="font-semibold">
                  {sale.date} - {sale.time}
                </span>
                <div className="text-sm text-muted-foreground">
                  {costPrivilege.canRead() &&
                    `Total Cost: ${sale.total_cost?.amount} ${sale.total_cost?.currency} — `}
                  {`Total Revenue: ${sale.total_revenue?.amount} ${sale.total_revenue?.currency} `}
                  {costPrivilege.canRead() &&
                    `— Total Profit: ${sale.total_profit?.amount} ${sale.total_profit?.currency}`}
                </div>
              </div>
              <div className="flex gap-2">
                {sale.saleItems.map((item) => (
                  <Badge key={item.item_id} variant="secondary">
                    {item.name}
                  </Badge>
                ))}
              </div>
              <div className="flex">
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setSaleToDelete(sale.id)
                    setConfirmOpen(true)
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.stopPropagation()
                      setSaleToDelete(sale.id)
                      setConfirmOpen(true)
                    }
                  }}
                  aria-label="Delete sale"
                  className="ml-4 text-red-500 hover:text-red-700 active:text-red-900 transition-colors duration-150 cursor-pointer">
                  <Trash2 />
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="bg-muted px-4 pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  {costPrivilege.canRead() && <TableHead>Cost</TableHead>}
                  <TableHead>Price</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Quantity</TableHead>
                  {costPrivilege.canRead() && <TableHead>Profit</TableHead>}
                  <TableHead>Note</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.saleItems.map((saleItem) => (
                  <TableRow className="" key={saleItem.id}>
                    <TableCell>{saleItem.name}</TableCell>
                    {costPrivilege.canRead() && (
                      <TableCell>
                        <PriceInput
                          amount={saleItem.cost?.amount || 0}
                          currency={saleItem.cost?.currency || 'USD'}
                          onChange={(val) =>
                            // updateSaleItemCost(sale.id, saleItem.id, val)
                            patchSaleItem({
                              saleId: sale.id,
                              itemId: saleItem.id,
                              data: { cost: val },
                            })
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <PriceInput
                        amount={saleItem.price?.amount || 0}
                        currency={saleItem.price?.currency || 'USD'}
                        onChange={(val) =>
                          // updateSaleItemPrice(sale.id, saleItem.id, val)
                          patchSaleItem({
                            saleId: sale.id,
                            itemId: saleItem.id,
                            data: { price: val },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <PriceInput
                        amount={saleItem.revenue?.amount || 0}
                        currency={saleItem.revenue?.currency || 'USD'}
                        editable={false}
                        onChange={() => {}}
                      />
                    </TableCell>
                    <TableCell>
                      <QuantityInput
                        quantity={saleItem.quantity}
                        onChange={function (val: number): void {
                          // updateSaleItemQuantity(sale.id, saleItem.id, val)
                          patchSaleItem({
                            saleId: sale.id,
                            itemId: saleItem.id,
                            data: { quantity: val },
                          })
                        }}
                      />
                    </TableCell>
                    {costPrivilege.canRead() && (
                      <TableCell>
                        {(
                          (saleItem.price?.amount ?? 0) -
                          (saleItem.cost?.amount ?? 0)
                        ).toFixed(2)}{' '}
                        {saleItem.price?.currency}
                      </TableCell>
                    )}
                    <TableCell>
                      <TextInput
                        value={saleItem.note || ' '}
                        onChange={(val) =>
                          // updateSaleItemNote(sale.id, saleItem.id, val)
                          patchSaleItem({
                            saleId: sale.id,
                            itemId: saleItem.id,
                            data: { note: val },
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="flex justify-end mr-6">
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          setSaleItemToDelete({
                            saleId: sale.id,
                            itemId: saleItem.id,
                          })
                          setConfirmOpen(true)
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation()
                            setSaleItemToDelete({
                              saleId: sale.id,
                              itemId: saleItem.id,
                            })
                            setConfirmOpen(true)
                          }
                        }}
                        aria-label="Delete sale item"
                        className="text-red-500 hover:text-red-700 active:text-red-900 transition-colors duration-150 cursor-pointer">
                        <Trash2 />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default SalesList
