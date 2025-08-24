<?php

namespace App\Services;

use App\Models\Sale;

class SaleService
{
    private const USD_LB_RATE = 89_500; // Adjust as needed

    /**
     * Calculate total revenue and profit in USD.
     */
    public function calculateTotals(array $items): array
    {
        $total = 0;
        $profit = 0;

        foreach ($items as $item) {
            $quantity = $item['quantity'];

            // Convert sell price to USD
            $sellAmount = $this->toUSD(
                $item['sell_price']['amount'],
                $item['sell_price']['currency']
            );

            // Convert buy price to USD
            $buyAmount = $this->toUSD(
                $item['buy_price']['amount'] ?? 0,
                $item['buy_price']['currency'] ?? $item['sell_price']['currency']
            );

            $total += $sellAmount * $quantity;
            $profit += ($sellAmount - $buyAmount) * $quantity;
        }

        return [
            'total' => round($total, 2),
            'profit' => round($profit, 2),
            'currency' => 'USD',
        ];
    }

    /**
     * Attach items to a Sale with pivot data.
     */
    public function attachItems(Sale $sale, array $items): void
    {
        $syncData = [];
        foreach ($items as $item) {
            $syncData[$item['item_id']] = [
                'quantity' => $item['quantity'],
                'sell_price_amount' => $item['sell_price']['amount'],
                'sell_price_currency' => $item['sell_price']['currency'],
                'buy_price_amount' => $item['buy_price']['amount'],
                'buy_price_currency' => $item['buy_price']['currency'],
            ];
        }
        $sale->items()->sync($syncData);
    }

    /**
     * Convert amount to USD.
     */
    private function toUSD(float $amount, string $currency): float
    {
        return $currency === 'USD' ? $amount : $amount / self::USD_LB_RATE;
    }
}
