<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\SaleItem;
use App\ValueObjects\Money;

class SaleService
{
    public function updateAttachedSaleItems(Sale $sale, array $items): void
    {
        // Delete existing sale items for this sale
        $sale->saleItems()->delete();

        // Create new sale items with proper ordering
        foreach ($items as $index => $item) {
            $sale->saleItems()->create([
                'item_id' => $item['item_id'] ?? null,
                'quantity' => $item['quantity'],
                'cost' => $item['cost'],
                'price' => $item['price'],
                'sort_order' => $item['sort_order'] ?? $index + 1, // Auto-assign order if not provided
            ]);
        }
    }

    public function updateSaleTotals(Sale $sale): void
    {
        $saleItems = $sale->saleItems()->get();
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

    /**
     * Reorder sale items by updating their sort_order
     */
    public function reorderSaleItems(Sale $sale, array $itemIds): void
    {
        foreach ($itemIds as $index => $itemId) {
            SaleItem::where('id', $itemId)
                ->where('sale_id', $sale->id)
                ->update(['sort_order' => $index + 1]);
        }
    }

    /**
     * Get the next sort order for a sale
     */
    public function getNextSortOrder(Sale $sale): int
    {
        $maxOrder = $sale->saleItems()->max('sort_order') ?? 0;
        return $maxOrder + 1;
    }
}