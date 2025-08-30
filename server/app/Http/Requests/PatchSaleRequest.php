<?php

namespace App\Http\Requests;


class PatchSaleRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sold_at' => 'sometimes|date',
        ];
    }
}
