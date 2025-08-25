<?php
namespace App\Http\Requests;

use App\Traits\MoneyCastingTrait;

class StoreSaleRequest extends BaseFormRequest
{
    use MoneyCastingTrait;
    
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sell_price.amount' => 'required|numeric|min:0',
            'items.*.sell_price.currency' => 'required|in:USD,LBP',
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
        
        foreach ($validated['items'] as &$item) {
            $this->castSaleItemMoney($item);
        }
        
        return $validated;
    }
}