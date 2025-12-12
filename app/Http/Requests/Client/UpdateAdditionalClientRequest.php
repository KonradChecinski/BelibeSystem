<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAdditionalClientRequest extends FormRequest
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
            'blacklist' => 'required|boolean',
            'newsletter' => 'required|boolean',
            'settlements_mail' => 'required|boolean',
            'priority' => 'required|numeric',
            'payments' => 'required|array',
            'payments.*.id' => 'required|numeric',
            'source_of_acquisition' => 'required',
            'source_of_acquisition.id' => 'required|numeric',
            'status' => 'required',
            'status.id' => 'numeric|numeric',
        ];
    }
}
