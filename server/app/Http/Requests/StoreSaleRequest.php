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
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.cost.amount' => 'nullable|numeric|min:0',
            'items.*.cost.currency' => 'nullable|in:USD,LBP',
            'items.*.price.amount' => 'required|numeric|min:0',
            'items.*.price.currency' => 'required|in:USD,LBP',
        ];
    }

    protected function passedValidation()
    {
        $this->merge([
            'sold_at' => $this->input('sold_at', now()),
        ]);
    }

    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        $validated->items = $this->castMoneyItemsFields($validated->items, ['cost', 'price']);
        return $validated;
    }
}