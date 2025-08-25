<?php
namespace App\Traits;

use App\ValueObjects\Money;
use App\ValueObjects\Currency;

trait MoneyCastingTrait
{
    /**
     * Cast a money array to Money object
     */
    protected function castMoneyField(?array $moneyData, ?Currency $defaultCurrency = null): ?Money
    {
        if (!$moneyData || !isset($moneyData['amount'])) {
            return null;
        }

        $currency = isset($moneyData['currency'])
            ? Currency::from($moneyData['currency'])
            : ($defaultCurrency ?? Currency::USD);

        return new Money((float) $moneyData['amount'], $currency);
    }

    /**
     * Cast money fields for sale items
     */
    protected function castSaleItemMoney(array &$item): void
    {
        // Cast sell_price to Money object
        $item['sell_price'] = $this->castMoneyField($item['sell_price']);

        // Cast buy_price to Money object if provided, defaulting to sell_price currency
        if (isset($item['buy_price']['amount'])) {
            $item['buy_price'] = $this->castMoneyField(
                $item['buy_price'],
                $item['sell_price']->currency
            );
        } else {
            // Default buy price to 0 in the same currency as sell price
            $item['buy_price'] = new Money(0, $item['sell_price']->currency);
        }
    }
}