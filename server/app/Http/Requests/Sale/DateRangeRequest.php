<?php

namespace App\Http\Requests\Sale;

use App\Http\Requests\BaseFormRequest;

class DateRangeRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ];
    }
}
