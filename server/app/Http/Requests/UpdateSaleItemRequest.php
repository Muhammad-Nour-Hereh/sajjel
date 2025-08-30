<?php

namespace App\Http\Requests;

class UpdateSaleItemRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'item_id' => 'nullable|exists:items,id',
            'cost' => 'required',
            'price' => 'required',
            'quantity' => 'required|integer|min:1',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }
}