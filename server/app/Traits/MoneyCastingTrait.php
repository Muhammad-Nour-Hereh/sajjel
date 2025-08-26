<?php

namespace App\Traits;

use App\ValueObjects\Money;
use App\ValueObjects\Currency;
use Illuminate\Validation\ValidationException;

trait MoneyCastingTrait
{
    /**
     * Cast multiple fields into Money objects if present.
     */
    protected function castMoneyFields(array $data, array $fields): array
    {
        foreach ($data["items"] as $index => $item)
            foreach ($fields as $field) {
                if (!isset($item[$field]))
                    throw ValidationException::withMessages([
                        "items.{$index}.{$field}" => "The {$field} field is required for item at index {$index}."
                    ]);

                $data['items'][$index][$field] = Money::of(
                    (float) $item[$field]['amount'],
                    Currency::from($item[$field]['currency'])
                );
            }
        return $data;
    }
}
