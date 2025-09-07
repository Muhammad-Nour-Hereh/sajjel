<?php

namespace App\Http\Requests;

use App\Http\Requests\BaseFormRequest;

class UpdateThumbnailRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }
}
