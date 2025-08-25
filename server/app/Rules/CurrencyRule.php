<?php
namespace App\Rules;

use App\ValueObjects\Currency;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\ValidatorAwareRule;
use Illuminate\Validation\Validator;

class CurrencyRule implements ValidationRule, ValidatorAwareRule
{
    protected Validator $validator;

    public function setValidator(Validator $validator): static
    {
        $this->validator = $validator;
        return $this;
    }

    public function validate(string $attribute, mixed $value, \Closure $fail): void
    {
        try {
            Currency::from($value);
        } catch (\ValueError) {
            $validCurrencies = implode(', ', array_column(Currency::cases(), 'value'));
            $fail("The {$attribute} must be one of: {$validCurrencies}.");
        }
    }
}