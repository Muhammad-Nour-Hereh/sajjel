<?php

namespace App\Http\Requests;

class StoreItemRequest extends BaseFormRequest {
    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'name'        => 'required|string|max:255',
            'model'       => 'nullable|string|max:255',
            'buy_price'   => 'nullable|numeric|min:0',
            'sell_price'  => 'nullable|numeric|min:0',
            'thumbnail'   => 'nullable|string|max:255',
            'note'        => 'nullable|string|max:1000',
        ];
    }
}
