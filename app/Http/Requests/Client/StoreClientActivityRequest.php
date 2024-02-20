<?php

namespace App\Http\Requests\Client;

use Illuminate\Foundation\Http\FormRequest;

class StoreClientActivityRequest extends FormRequest
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
            'type' => 'required',
            'type.id' => 'required|numeric',
            'type.name' => 'required|string',
            'description' => 'required|string',
            'datetime' => 'required|date',
            'user' => '',
            'user.id' => 'numeric',
            'user.name' => 'string',
        ];
    }
}
