<?php

namespace App\Http\Requests;

class RegisterRequest extends BaseFormRequest {
    public function authorize() {
        return true;
    }

    public function rules() {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
        ];
    }
}