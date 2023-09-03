<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("createProducts", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'color.id' => 'required|numeric',
            'symbol' => 'required|string|min:5',
            'name' => 'required|string|min:5',
            'size' => 'required|string',
            'unit' => 'required|string',
            'barcode' => 'required|array',
            'barcode.*.id' => 'required|numeric',
            'barcode.*.barcode' => 'required|string|min:13|max:13'
        ];
    }
}
