<?php

namespace App\Http\Requests;

use App\Models\ProductColorIcon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductColorIconRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editDictionary", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "*.id" => 'required|integer',
            "*.name" => 'required|string|max:255',
            "*.type" => 'required|integer|min:0|max:1',
            "*.hex" => 'nullable|string|max:7|min:7',
            '*.files' => "nullable|array",
            '*.files.*' => [
                "nullable",
                "image",
                "mimes:jpeg,png,jpg",
                "max:2048",
                Rule::dimensions()->width(80)->height(80)
            ],
        ];
    }
}
