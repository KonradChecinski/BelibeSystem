<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editWarehouseDocument", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "*.id" => ["nullable", "integer", "exists:warehouse_document_products,id"],
            "*.quantity" => ["required", "integer", "min:1"],
            "*.product.id" => ["required_if:*.id,null", "integer", "exists:products,id"],
        ];
    }
}
