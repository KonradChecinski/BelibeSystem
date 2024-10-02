<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductModelPriceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("updateProductPrice", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'vat_rate' => 'required|numeric',
            'wholesale_net_price' => 'required|numeric',
            'wholesale_gross_price' => 'required|numeric',
            'retail_net_price' => 'required|numeric',
            'retail_gross_price' => 'required|numeric',
            'b2c_net_price' => 'required|numeric',
            'b2c_gross_price' => 'required|numeric',
        ];
    }
}
