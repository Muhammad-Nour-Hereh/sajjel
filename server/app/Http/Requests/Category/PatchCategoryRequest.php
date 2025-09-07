<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\BaseFormRequest;

class PatchCategoryRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
        ];
    }
}
