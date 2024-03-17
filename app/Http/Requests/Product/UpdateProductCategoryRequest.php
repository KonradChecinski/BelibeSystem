<?php

namespace App\Http\Requests\Product;

use App\Models\Products\ProductCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        return [
            "*.id" => 'present|integer|nullable',
            "*.name" => 'required|string|max:255',
            "*.slug" =>
                Rule::forEach(function ($value, $attribute, $data) {
                    return [
                        'nullable', 'string', 'max:255', Rule::unique(ProductCategory::class)->ignore($data[explode(".", $attribute)[0] . ".id"]),
                    ];
                }),
            "*.parent" => 'required|integer',
            "*.show_in_menu" => 'required|boolean',
        ];
    }
}
