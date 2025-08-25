<?php

namespace App\Casts;

use App\ValueObjects\Money;
use App\ValueObjects\Currency;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use InvalidArgumentException;

class AsMoney implements CastsAttributes
{
    /**
     * Cast the given value to Money object.
     */
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

    /**
     * Prepare the given value for storage.
     */
    public function set(Model $model, string $key, $value, array $attributes): array
    {
        if ($value === null) {
            return [
                $key . '_amount' => null,
                $key . '_currency' => null,
            ];
        }

        // Handle Money objects
        if ($value instanceof Money) {
            return [
                $key . '_amount' => $value->amount,
                $key . '_currency' => $value->currency->value,
            ];
        }

        // Handle nested arrays from requests (e.g., ['amount' => 100, 'currency' => 'USD'])
        if (is_array($value)) {
            $amount = $value['amount'] ?? 0;
            $currency = $value['currency'] ?? 'USD';

            return [
                $key . '_amount' => (float) $amount,
                $key . '_currency' => $currency,
            ];
        }

        throw new InvalidArgumentException('Value must be an instance of Money or an array with amount/currency keys');
    }
}