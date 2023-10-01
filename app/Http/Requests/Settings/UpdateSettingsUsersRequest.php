<?php

namespace App\Http\Requests\Settings;

use App\Models\Client\ClientUser;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateSettingsUsersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editUser", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string|max:255",
            "email" =>[
                "required",
                "email",
                "max:255",
                    Rule::unique("users")->ignore($this->user->email, "email")
            ],
            "password" => [
                Rule::when($this->password == null,
                [

                ],
                [
                    Password::defaults()
                ]),
            ],
            "roles" => "required|array"
        ];
    }
}
