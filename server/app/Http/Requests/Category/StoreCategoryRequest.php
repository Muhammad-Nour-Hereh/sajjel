<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\BaseFormRequest;

class StoreCategoryRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }
}
