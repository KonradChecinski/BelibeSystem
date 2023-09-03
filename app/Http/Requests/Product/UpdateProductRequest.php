<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editProducts", "user");
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
            'size' => 'required',
            'size.id' => 'required|numeric',
            'unit' => 'required',
            'unit.id' => 'required|numeric',
            'barcodes' => 'required|array',
            'barcodes.*.id' => 'required|numeric',
            'barcodes.*.barcode' => 'required|string|min:13|max:13'
        ];
    }
}
