<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePartnerExportRequest extends FormRequest
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
            'type' => 'required|integer|min:1|max:3',
            'availability'=> 'required|boolean',
            'wholesale_net_price'=> 'required|boolean',
            'retail_gross_price'=> 'required|boolean',
            'description'=> 'required|boolean',
            'image_basic'=> 'required|boolean',
            'image_square'=> 'required|boolean',
            'image_webp'=> 'required|boolean',
            "cron" => 'required|string|max:25',
        ];
    }
}
