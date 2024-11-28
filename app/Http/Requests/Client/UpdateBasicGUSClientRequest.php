<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBasicGUSClientRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'city' => 'required|string',
            'street' => 'required|string',
            'postal_code' => 'required|string',
            'building_number' => 'required|string',
            'apartment_number' => 'string|nullable',
            'name' => 'required|string',
            'email' => 'required|string',
        ];
    }
}
