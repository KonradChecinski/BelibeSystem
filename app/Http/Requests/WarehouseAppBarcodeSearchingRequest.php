<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class WarehouseAppBarcodeSearchingRequest extends FormRequest
{
    public function __construct()
    {
        parent::__construct();

        Validator::extend('ean13', function ($attribute, $value, $parameters, $validator) {
            return $this->isValidEan13($value);
        });
    }


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
            'barcode' => [
                'required',
                'string',
                'min:13',
                'max:13',
                'regex:/^[0-9]+$/',
                'ean13',
            ],
        ];
    }


    private function isValidEan13(string $barcode): bool
    {
        if (strlen($barcode) !== 13 || !ctype_digit($barcode)) {
            return false;
        }

        $sum = 0;
        for ($i = 0; $i < 12; $i++) {
            $digit = (int)$barcode[$i];
            $sum += ($i % 2 === 0) ? $digit : $digit * 3;
        }

        $checksum = (10 - ($sum % 10)) % 10;

        return $checksum === (int)$barcode[12];
    }

    public function messages()
    {
        return [
            'barcode.ean13' => 'Podany kod kreskowy nie jest prawidłowym kodem EAN-13.',
        ];
    }

}
