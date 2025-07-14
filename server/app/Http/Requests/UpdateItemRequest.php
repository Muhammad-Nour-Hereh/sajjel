<?php

namespace App\Http\Requests;

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
}
