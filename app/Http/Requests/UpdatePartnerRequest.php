<?php

namespace App\Http\Requests;

use App\Helpers\Subiekt\SubiektQueries;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePartnerRequest extends FormRequest
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
            "name" => "required|string|max:255",
            "warehouse_id" => [
                "required",
                "integer",
                Rule::in(collect(SubiektQueries::getActiveWarehouse())->pluck("mag_Id")->toArray()),
            ],
            "subiekt_category_id" => [
                "required",
                "integer",
                Rule::in(collect(SubiektQueries::getDocumentCategory())->pluck("kat_Id")->toArray()),
            ]

        ];
    }
}
