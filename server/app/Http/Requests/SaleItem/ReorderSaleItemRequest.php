<?php

namespace App\Http\Requests\SaleItem;

use App\Http\Requests\BaseFormRequest;

class ReorderSaleItemRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'item_ids' => 'required|array|min:1',
            'item_ids.*' => 'required|integer|exists:sale_items,id',
        ];
    }

    public function messages(): array
    {
        return [
            'item_ids.required' => 'Item IDs are required for reordering',
            'item_ids.array' => 'Item IDs must be an array',
            'item_ids.*.exists' => 'One or more sale items do not exist',
        ];
    }

    /**
     * Validate that all items belong to the same sale
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('item_ids')) {
                $saleIds = \App\Models\SaleItem::whereIn('id', $this->item_ids)
                    ->distinct()
                    ->pluck('sale_id');

                if ($saleIds->count() > 1) {
                    $validator->errors()->add('item_ids', 'All items must belong to the same sale');
                }

                // If we have a sale route parameter, validate items belong to that sale
                if ($this->route('sale')) {
                    $routeSaleId = $this->route('sale')->id ?? $this->route('sale');
                    if ($saleIds->isNotEmpty() && !$saleIds->contains($routeSaleId)) {
                        $validator->errors()->add('item_ids', 'Items must belong to the specified sale');
                    }
                }
            }
        });
    }
}