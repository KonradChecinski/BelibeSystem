<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editDictionary", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
//        dd($this->all());
        return [
            "*.id" => 'present|integer|nullable',
            "*.name" => 'required|string|max:255',
            "*.parent" => 'required|integer',
            "*.show_in_menu" => 'required|boolean',
        ];
    }
}
