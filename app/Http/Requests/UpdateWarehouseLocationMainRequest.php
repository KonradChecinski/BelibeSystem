<?php

namespace App\Http\Requests;

use App\Models\WarehouseLocation;
use App\Models\WarehouseLocationAisle;
use App\Models\WarehouseLocationRoom;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseLocationMainRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editModel", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'main' => ['required', 'boolean'],
        ];
    }
}
