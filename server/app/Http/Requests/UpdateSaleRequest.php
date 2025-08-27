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
            'items' => 'sometimes|array|min:1',
            'items.*.item_id' => 'required_with:items|exists:items,id',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.cost.amount' => 'nullable|numeric|min:0',
            'items.*.cost.currency' => 'nullable|in:USD,LBP',
            'items.*.price.amount' => 'required_with:items|numeric|min:0',
            'items.*.price.currency' => 'required_with:items|in:USD,LBP',
        ];
    }

    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        $validated['items'] = $this->castMoneyItemsFields($validated['items'], ['cost', 'price']);
        return $validated;
    }
}