<?php
namespace App\Http\Requests;

use App\Traits\MoneyCastingTrait;

class StoreItemRequest extends BaseFormRequest
{
    use MoneyCastingTrait;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'model' => 'nullable|string|max:255',

            'cost' => 'nullable|array',
            'cost.amount' => 'required_with:cost|numeric|min:0',
            'cost.currency' => 'required_with:cost|in:USD,LBP',

            'price' => 'nullable|array',
            'price.amount' => 'required_with:price|numeric|min:0',
            'price.currency' => 'required_with:price|in:USD,LBP',

            'thumbnail' => 'nullable|image|max:2048',
            'note' => 'nullable|string|max:1000',
        ];
    }

    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        return $this->castMoneyFields($validated, ['cost', 'price']);
    }
}