<?php

namespace App\Http\Requests;

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
            'items.*.id' => 'required_with:items|exists:items,id',
            // 'items.*.quantity' => 'required_with:items|integer|min:1',
            
            'items.*.sell_price.amount' => 'required|numeric|min:0',
            'items.*.sell_price.currency' => 'required|in:USD,LBP',

            'items.*.buy_price.amount' => 'nullable|numeric|min:0',
            'items.*.buy_price.currency' => 'nullable|in:USD,LBP',
        ];
    }
}
