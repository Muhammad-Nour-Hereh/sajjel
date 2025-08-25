<?php
namespace App\Http\Requests;

use App\ValueObjects\Money;
use App\ValueObjects\Currency;

class UpdateItemRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'buy_price' => 'nullable|array',
            'buy_price.amount' => 'required_with:buy_price|numeric|min:0',
            'buy_price.currency' => 'required_with:buy_price|in:USD,LBP',
            'sell_price' => 'nullable|array',
            'sell_price.amount' => 'required_with:sell_price|numeric|min:0',
            'sell_price.currency' => 'required_with:sell_price|in:USD,LBP',
            'note' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get validated data with Money objects cast from arrays
     */
    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        
        // Cast buy_price to Money object if provided
        if (isset($validated['buy_price'])) {
            $validated['buy_price'] = new Money(
                (float) $validated['buy_price']['amount'],
                Currency::from($validated['buy_price']['currency'])
            );
        }
        
        // Cast sell_price to Money object if provided
        if (isset($validated['sell_price'])) {
            $validated['sell_price'] = new Money(
                (float) $validated['sell_price']['amount'],
                Currency::from($validated['sell_price']['currency'])
            );
        }
        
        return $validated;
    }
}