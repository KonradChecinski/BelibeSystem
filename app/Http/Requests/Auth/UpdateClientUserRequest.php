<?php

namespace App\Http\Requests\Auth;

use App\Models\Client\ClientUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateClientUserRequest extends FormRequest
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
            "name" => "required|string|max:255",
            "email" => [
                "required", "string", "email", "max:255",
                Rule::unique(ClientUser::class)->ignore($this->clientUser->id),
            ],
            "password" => ["required", Password::defaults()],
        ];
    }
}
