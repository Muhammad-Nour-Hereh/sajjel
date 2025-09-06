<?php

namespace App\Http\Requests\SaleItem;

use App\Http\Requests\BaseFormRequest;

class PatchSaleItemRequest extends BaseFormRequest
{
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
