<?php

namespace App\Http\Requests\Sale;

use App\Http\Requests\BaseFormRequest;


class PatchSaleRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'sold_at' => 'sometimes|date',
        ];
    }
}
