<?php
namespace App\Services;

use App\Models\Sale;
use App\ValueObjects\Money;
use App\ValueObjects\Currency;

class SaleService
{
    public function attachItems(Sale $sale, array $items): void
    {
        $syncData = [];
        foreach ($items as $item) {
            $syncData[$item['item_id']] = [
                'quantity' => $item['quantity'],
                'cost' => $item['cost'],
                'price' => $item['price'],
            ];
        }
        $sale->items()->sync($syncData);
    }

    public function updateSaleTotals(Sale $sale): void
    {
        // Pull pivot models instead of plain items
        $saleItems = $sale->items()->get();

        $totalCost = Money::zero();
        $totalRevenue = Money::zero();

        foreach ($saleItems as $item) {
            $pivot = $item->pivot; // SaleItem pivot

            if ($pivot->cost && $pivot->price) {
                // Use pivot casts directly
                $itemCost = $pivot->cost->toUSD()->multiply($pivot->quantity);
                $itemRevenue = $pivot->price->toUSD()->multiply($pivot->quantity);

                $totalCost = $totalCost->add($itemCost);
                $totalRevenue = $totalRevenue->add($itemRevenue);
            }
        }

        $sale->update([
            'total_cost' => $totalCost,
            'total_revenue' => $totalRevenue,
        ]);
    }
}