<?php

namespace App\Http\Requests\SaleItem;

use App\Http\Requests\BaseFormRequest;

class StoreSaleItemRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'item_id' => 'nullable|exists:items,id',
            'name' => 'required_without:item_id|string|max:255',

            'cost.amount' => 'nullable|numeric|min:0',
            'cost.currency' => 'nullable|in:USD,LBP',
            'price.amount' => 'required|numeric|min:0',
            'price.currency' => 'required|in:USD,LBP',

            'note' => 'nullable|string|max:1000',
            'quantity' => 'required|integer|min:1',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }
}
