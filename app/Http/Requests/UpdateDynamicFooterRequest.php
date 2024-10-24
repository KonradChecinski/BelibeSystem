<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDynamicFooterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editPages", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "content" => "required|array",
            "content.*.type" => "required|string",
            "content.*.props" => "required|array",
            "zones" => "required|array",
            "zones.*" => "nullable|array",
            "zones.*.*.type" => "required|string|nullable",
            "zones.*.*.props" => "required|array|nullable",
        ];
    }
}
