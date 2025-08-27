<?php

namespace App\Services;

use App\Models\Sale;
use App\ValueObjects\Money;

class SaleService
{
    public function updateAttachedSaleItems(Sale $sale, array $items): void
    {
        // Delete existing sale items for this sale
        $sale->saleItems()->delete();

        // Create new sale items
        foreach ($items as $item) {
            $sale->saleItems()->create([
                'item_id' => $item['item_id'] ?? null, // Can be null for unregistered items
                'quantity' => $item['quantity'],
                'cost' => $item['cost'],
                'price' => $item['price'],
            ]);
        }
    }

    public function updateSaleTotals(Sale $sale): void
    {
        $saleItems = $sale->saleItems;

        $totalCost = Money::zero();
        $totalRevenue = Money::zero();

        foreach ($saleItems as $saleItem) {
            if ($saleItem->cost && $saleItem->price) {
                $itemCost = $saleItem->cost->toUSD()->multiply($saleItem->quantity);
                $itemRevenue = $saleItem->price->toUSD()->multiply($saleItem->quantity);

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