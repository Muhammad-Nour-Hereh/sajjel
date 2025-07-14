<?php

namespace App\Traits;

trait Utils
{
    protected function flattenPrices(array $data): array
    {
        if (isset($data['buy_price']) && is_array($data['buy_price'])) {
            $data['buy_price_amount'] = $data['buy_price']['amount'] ?? 0;
            $data['buy_price_currency'] = $data['buy_price']['currency'] ?? 'USD';
        }

        if (isset($data['sell_price']) && is_array($data['sell_price'])) {
            $data['sell_price_amount'] = $data['sell_price']['amount'] ?? 0;
            $data['sell_price_currency'] = $data['sell_price']['currency'] ?? 'USD';
        }

        return $data;
    }
}
