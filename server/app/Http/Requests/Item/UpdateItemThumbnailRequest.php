<?php

namespace App\Http\Requests\Item;

use App\Http\Requests\BaseFormRequest;

class UpdateItemThumbnailRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }
}
