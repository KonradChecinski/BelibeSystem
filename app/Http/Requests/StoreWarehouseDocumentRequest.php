<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWarehouseDocumentRequest extends FormRequest
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
        $warehouseDocument = $this->route("warehouseDocument");
        $hasPartner = $warehouseDocument?->clientOrder?->client?->partner !== null;

        return [
            "create_type" => ["required", "in:" . ($hasPartner ? "0,1,2" : "0,1")],
        ];
    }
}
