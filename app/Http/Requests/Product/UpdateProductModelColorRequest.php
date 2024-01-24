<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductModelColorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editModel", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'string|required|min:3',
            'b2c_name' => 'array|required',
            'b2c_shortcut' => 'string|required|min:1|max:10',
            'b2c_product_name' => 'string|required|min:3',
        ];
    }
}
