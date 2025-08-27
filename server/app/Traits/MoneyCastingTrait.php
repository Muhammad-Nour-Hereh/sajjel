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
    protected function castMoneyItemsFields(array $items, array $fields): array
    {
        foreach ($items as $index => $item)
            foreach ($fields as $field) {
                if (!isset($item[$field]))
                    throw ValidationException::withMessages([
                        "items.{$index}.{$field}" => "The {$field} field is required for item at index {$index}."
                    ]);

                $items[$index][$field] = Money::of(
                    (float) $item[$field]['amount'],
                    Currency::from($item[$field]['currency'])
                );
            }
        return $items;
    }

    protected function castMoneyItemFields(array $item, array $fields): array
    {
        foreach ($fields as $field) {
            if (!isset($item[$field]))
                throw ValidationException::withMessages([
                    "items{$field}" => "The {$field} field is required for item."
                ]);

            $item[$field] = Money::of(
                (float) $item[$field]['amount'],
                Currency::from($item[$field]['currency'])
            );
        }
        return $item;
    }
}
