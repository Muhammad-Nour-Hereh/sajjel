<?php

namespace App\Http\Requests;

class PatchSaleItemRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_id' => 'sometimes|nullable|exists:items,id',
            'cost' => 'sometimes',
            'price' => 'sometimes',
            'quantity' => 'sometimes|integer|min:1',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }
}
