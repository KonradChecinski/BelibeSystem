<?php

namespace App\Http\Requests\Settings;

use App\Models\Client\ClientUser;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreSettingsUsersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("createUser", "user");
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
            "email" =>
                "required|string|email|max:255|unique:" .
                ClientUser::class .
                "|unique:" .
                User::class,
            "phone" => "nullable|string|max:12|min:12",
            "subiekt_category_name" => "nullable|string|max:255",
            "password" => ["required", Password::defaults()],
            "roles" => "required|array"
        ];
    }
}
