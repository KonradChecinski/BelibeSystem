<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class WarehouseAppBarcodeSearchingBySymbolRequest extends FormRequest
{


    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'symbol' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-Z0-9_\-]+$/', // Allow alphanumeric characters, underscores, and hyphens
            ],
        ];
    }


}
