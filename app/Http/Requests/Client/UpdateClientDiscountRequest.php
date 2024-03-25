<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClientDiscountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editClient", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "type" => 'required|array',
            "type.id" => 'required|integer|min:1|max:5',
            "product_model" => [
                Rule::when($this->type === 1, ['required', 'array'], ['nullable'])
            ],
            "product_model.id" => [
                Rule::when($this->type === 1, ['required', 'integer'])
            ],
            "product_category" => [
                Rule::when($this->type === 2, ['required', 'array'], ['nullable'])
            ],
            "product_category.id" => [
                Rule::when($this->type === 2, ['required', 'integer'])
            ],
            "product_group" => [
                Rule::when($this->type === 3, ['required', 'array'], ['nullable'])
            ],
            "product_group.id" => [
                Rule::when($this->type === 3, ['required', 'integer'])
            ],
            "product_brand" => [
                Rule::when($this->type === 4, ['required', 'array'], ['nullable'])
            ],
            "product_brand.id" => [
                Rule::when($this->type === 4, ['required', 'integer'])
            ],
            "value" => "required|integer",
        ];
    }
}
