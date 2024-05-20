<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePartnerExportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editPartners", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|integer|min:1|max:2',
            "cron" => 'required|string|max:25',
        ];
    }
}
