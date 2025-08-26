<?php
namespace App\Http\Requests;

use App\Traits\MoneyCastingTrait;

class UpdateItemRequest extends BaseFormRequest
{
    use MoneyCastingTrait;
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:1000',

            'cost' => 'nullable|array',
            'cost.amount' => 'required_with:cost|numeric|min:0',
            'cost.currency' => 'required_with:cost|in:USD,LBP',

            'price' => 'nullable|array',
            'price.amount' => 'required_with:price|numeric|min:0',
            'price.currency' => 'required_with:price|in:USD,LBP',
        ];
    }

    public function validatedWithCasts(): array
    {
        $validated = $this->validated();
        return $this->castMoneyFields($validated, ['cost', 'price']);
    }
}
