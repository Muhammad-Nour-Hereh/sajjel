<?php

namespace App\Casts;

use App\ValueObjects\Money;
use App\ValueObjects\Currency;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class AsMoney implements CastsAttributes
{
    protected $amountField;
    protected $currencyField;

    public function __construct(?string $amountField = null, ?string $currencyField = null)
    {
        $this->amountField = $amountField;
        $this->currencyField = $currencyField;
    }

    public function get(Model $model, string $key, $value, array $attributes): ?Money
    {
        // Determine field names
        $amountField = $this->amountField ?? $key . '_amount';
        $currencyField = $this->currencyField ?? $key . '_currency';

        // Get amount and currency from attributes
        $amount = $attributes[$amountField] ?? null;
        $currency = $attributes[$currencyField] ?? null;

        if ($amount === null || $currency === null) {
            return null;
        }

        return new Money($amount, Currency::from($currency));
    }

    public function set(Model $model, string $key, $value, array $attributes): array
    {
        if ($value === null) {
            return [
                $this->amountField ?? $key . '_amount' => null,
                $this->currencyField ?? $key . '_currency' => null,
            ];
        }

        if (!$value instanceof Money) {
            throw new \InvalidArgumentException('Value must be a Money instance');
        }

        return [
            $this->amountField ?? $key . '_amount' => $value->amount,
            $this->currencyField ?? $key . '_currency' => $value->currency->value,
        ];
    }
}