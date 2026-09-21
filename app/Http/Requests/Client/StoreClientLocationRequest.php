<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientLocationRequest extends FormRequest
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
            'country' => 'required',
            'country.id' => 'required|numeric',
            'country.name' => 'required|string',
            'city' => 'required|string',
            'street' => 'required|string',
            'postal_code' => 'required|string',
            'building_number' => 'required|string',
            'apartment_number' => 'string|nullable',
            'name' => 'required|string',
            'active' => 'required|boolean',
            'phone' => [
                'required',
                'string',
                'max:30',
                'regex:/^[0-9+\s()\-]*$/',
                function ($attribute, $value, $fail) {
                    $digits = preg_replace('/\D/', '', $value);

                    if (strlen($digits) < 9 || strlen($digits) > 15) {
                        $fail('Numer telefonu musi zawierać od 9 do 15 cyfr.');
                    }
                },
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
            ],
        ];
    }
}
