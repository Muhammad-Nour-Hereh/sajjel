<?php
namespace App\Http\Requests;

use App\Traits\MoneyCastingTrait;

class StoreSaleRequest extends BaseFormRequest
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
            'saleItems' => 'required|array|min:1',
            'saleItems.*.item_id' => 'nullable|exists:sale_items,id',
            'saleItems.*.quantity' => 'required|integer|min:1',
            'saleItems.*.cost.amount' => 'nullable|numeric|min:0',
            'saleItems.*.cost.currency' => 'nullable|in:USD,LBP',
            'saleItems.*.price.amount' => 'required|numeric|min:0',
            'saleItems.*.price.currency' => 'required|in:USD,LBP',
        ];
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'sold_at' => $this->input('sold_at', now()),
        ]);
    }

    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        $validated['saleItems'] = $this->castMoneyItemsFields($validated['saleItems'], ['cost', 'price']);
        return $validated;
    }
}