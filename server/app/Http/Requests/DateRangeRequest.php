<?php

namespace App\Http\Requests;

class DateRangeRequest extends BaseFormRequest
{

    public function authorize(): bool
    {
        return true;
    }



    public function rules(): array
    {
        return [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
        ];
    }
}
