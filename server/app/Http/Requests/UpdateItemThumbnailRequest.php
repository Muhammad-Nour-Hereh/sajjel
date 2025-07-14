<?php

namespace App\Http\Requests;

class UpdateItemThumbnailRequest extends BaseFormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }
}
