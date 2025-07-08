<?php

namespace App\Http\Requests;

class StoreItemRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',
            'buy_price' => 'nullable|numeric|min:0',
            'buy_price_currency' => 'required|in:USD,LBP',
            'sell_price' => 'nullable|numeric|min:0',
            'sell_price_currency' => 'required|in:USD,LBP',
            'thumbnail' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:1000',
        ];
    }

}
