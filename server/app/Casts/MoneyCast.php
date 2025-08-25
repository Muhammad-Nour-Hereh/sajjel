<?php

namespace App\Casts;

use App\ValueObjects\Currency;
use App\ValueObjects\Money;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class MoneyCast implements CastsAttributes
{
    public function get(Model $model, string $key, $value, array $attributes): ?Money
    {
        if ($value === null) {
            return null;
        }

        // If it's already a Money object, return it
        if ($value instanceof Money) {
            return $value;
        }

        // Get the corresponding amount and currency attributes
        $amountKey = $key . '_amount';
        $currencyKey = $key . '_currency';

        $amount = $attributes[$amountKey] ?? null;
        $currency = $attributes[$currencyKey] ?? null;

        if ($amount === null || $currency === null) {
            return null;
        }

        return new Money((float) $amount, Currency::from($currency));
    }

    public function set(Model $model, string $key, $value, array $attributes): array
    {
        if ($value === null) {
            return [
                $key . '_amount' => null,
                $key . '_currency' => null,
            ];
        }

        if (!$value instanceof Money) {
            throw new InvalidArgumentException('Value must be an instance of Money');
        }

        return [
            $key . '_amount' => $value->amount,
            $key . '_currency' => $value->currency->value,
        ];
    }
}
