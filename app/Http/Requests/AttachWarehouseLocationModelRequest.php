<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttachWarehouseLocationModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();

        return $user->hasPermissionTo("editDictionary", "user")
            || $user->hasPermissionTo("editModel", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $warehouseLocationId = $this->route('warehouseLocation')->getKey();

        return [
            'product_model_id' => [
                'bail',
                'required',
                'integer',
                'exists:product_models,id',
                Rule::unique('product_model_warehouse_location', 'product_model_id')
                    ->where(fn($q) => $q->where('warehouse_location_id', $warehouseLocationId)),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'product_model_id.required' => 'Wybierz model produktu.',
            'product_model_id.exists' => 'Wybrany model produktu nie istnieje.',
            'product_model_id.unique' => 'Ten model produktu jest już przypisany do wybranej lokalizacji magazynowej.',
        ];
    }
}
