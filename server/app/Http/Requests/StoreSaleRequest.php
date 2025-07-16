<?php

namespace App\Http\Requests;

class StoreSaleRequest extends BaseFormRequest
{
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
            'items.*.sell_price_amount' => 'required|numeric|min:0',
            'items.*.sell_price_currency' => 'required|in:USD,LBP',
            'items.*.buy_price_amount' => 'required|numeric|min:0',
            'items.*.buy_price_currency' => 'required|in:USD,LBP',
        ];
    }
}
