<?php
namespace App\Http\Requests;

use App\Traits\MoneyCastingTrait;


class UpdateSaleRequest extends BaseFormRequest
{
    use MoneyCastingTrait;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sold_at' => 'sometimes|date',
            'saleItems' => 'sometimes|array|min:1',
            'saleItems.*.item_id' => 'nullable|exists:sale_items,id',
            'saleItems.*.quantity' => 'required_with:saleItems|integer|min:1',
            'saleItems.*.cost.amount' => 'nullable|numeric|min:0',
            'saleItems.*.cost.currency' => 'nullable|in:USD,LBP',
            'saleItems.*.price.amount' => 'required_with:saleItems|numeric|min:0',
            'saleItems.*.price.currency' => 'required_with:saleItems|in:USD,LBP',
        ];
    }

    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        $validated['saleItems'] = $this->castMoneyItemsFields($validated['saleItems'], ['cost', 'price']);
        return $validated;
    }
}