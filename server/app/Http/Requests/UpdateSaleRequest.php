<?php
namespace App\Http\Requests;

use App\ValueObjects\Money;
use App\ValueObjects\Currency;

class UpdateSaleRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'sometimes|array|min:1',
            'items.*.item_id' => 'required_with:items|exists:items,id', // Fixed: was 'id' should be 'item_id'
            'items.*.quantity' => 'required_with:items|integer|min:1', // Fixed: uncommented this required field
            'items.*.sell_price.amount' => 'required_with:items|numeric|min:0',
            'items.*.sell_price.currency' => 'required_with:items|in:USD,LBP',
            'items.*.buy_price.amount' => 'nullable|numeric|min:0',
            'items.*.buy_price.currency' => 'nullable|in:USD,LBP',
        ];
    }

    /**
     * Get validated data with Money objects cast from arrays
     */
    public function validatedWithCasts(): array
    {
        $validated = $this->validated();

        if (isset($validated['items'])) {
            foreach ($validated['items'] as &$item) {
                // Cast sell_price to Money object
                $item['sell_price'] = new Money(
                    (float) $item['sell_price']['amount'],
                    Currency::from($item['sell_price']['currency'])
                );

                // Cast buy_price to Money object if provided
                if (isset($item['buy_price']['amount'])) {
                    $item['buy_price'] = new Money(
                        (float) $item['buy_price']['amount'],
                        Currency::from($item['buy_price']['currency'] ?? $item['sell_price']->currency->value)
                    );
                } else {
                    // Default buy price to 0 in the same currency as sell price
                    $item['buy_price'] = new Money(0, $item['sell_price']->currency);
                }
            }
        }

        return $validated;
    }
}