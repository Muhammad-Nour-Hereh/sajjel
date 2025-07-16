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
            'items.*.item_id' => 'required_with:items|exists:items,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.sell_price_amount' => 'required_with:items|numeric|min:0',
            'items.*.sell_price_currency' => 'required_with:items|in:USD,LBP',
            'items.*.buy_price_amount' => 'required_with:items|numeric|min:0',
            'items.*.buy_price_currency' => 'required_with:items|in:USD,LBP',
        ];
    }
}
