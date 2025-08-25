<?php
namespace App\Services;

use App\Models\Sale;
use App\ValueObjects\Money;
use App\ValueObjects\Currency;

class SaleService
{
    /**
     * Calculate total revenue and profit using Money value objects.
     */
    public function calculateTotals(array $items): array
    {
        $total = new Money(0, Currency::USD);
        $profit = new Money(0, Currency::USD);

        foreach ($items as $item) {
            $quantity = $item['quantity'];
            
            // Money objects are already cast from the request
            $sellPrice = $item['sell_price'];
            $buyPrice = $item['buy_price'];
            
            // Convert to USD for calculations
            $sellPriceUSD = $sellPrice->toUSD();
            $buyPriceUSD = $buyPrice->toUSD();
            
            // Calculate totals
            $itemTotal = new Money($sellPriceUSD->amount * $quantity, Currency::USD);
            $itemProfit = new Money(
                ($sellPriceUSD->amount - $buyPriceUSD->amount) * $quantity, 
                Currency::USD
            );
            
            $total = $total->add($itemTotal);
            $profit = $profit->add($itemProfit);
        }

        return [
            'total' => $total,
            'profit' => $profit,
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
                'sell_price_amount' => $item['sell_price']->amount,
                'sell_price_currency' => $item['sell_price']->currency->value,
                'buy_price_amount' => $item['buy_price']->amount,
                'buy_price_currency' => $item['buy_price']->currency->value,
            ];
        }
        
        $sale->items()->sync($syncData);
    }
}