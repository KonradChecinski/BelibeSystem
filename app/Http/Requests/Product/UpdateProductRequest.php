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

        $rules = [
            'color.id' => 'required|numeric',
            'symbol' => 'required|string|min:5',
            'name' => 'required|string|min:5',
            'name_b2c' => 'nullable|string|min:5',
            'size' => 'required',
            'size.id' => 'required|numeric',
            'unit' => 'required',
            'unit.id' => 'required|numeric',
            'barcodes' => 'required|array',
            'barcodes.*.id' => 'required|numeric',
            'barcodes.*.type' => 'required|numeric|min:1|max:3',

        ];

        foreach (request()->input('barcodes', []) as $index => $barcode) {
            $rules["barcodes.{$index}.barcode"] = [
                'required',
                'string',
                $barcode['type'] == 3 ? 'size:13' : ((strlen($barcode['barcode']) == 9) ? 'size:9' : 'size:13')
            ];
        }

        return $rules;
    }
}
