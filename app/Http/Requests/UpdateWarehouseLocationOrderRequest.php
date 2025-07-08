<?php

namespace App\Http\Requests;

use App\Models\WarehouseLocation;
use App\Models\WarehouseLocationAisle;
use App\Models\WarehouseLocationRoom;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWarehouseLocationOrderRequest extends FormRequest
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
            '*.id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) {
                    $type = request()->input(str_replace('.id', '.type', $attribute));
                    if ($type === 'room' && !WarehouseLocationRoom::find($value)) {
                        $fail(__('Room does not exist'));
                    } elseif ($type === 'aisle' && !WarehouseLocationAisle::find($value)) {
                        $fail(__('Aisle does not exist'));
                    } elseif ($type === 'shelf' && !WarehouseLocation::find($value)) {
                        $fail(__('Shelf does not exist'));
                    }
                },
            ],
//            '*.name' => ['required', 'string'],
            '*.type' => ['required', 'string', 'in:room,aisle,shelf'],
            '*.order' => [
                'required',
                'integer',
                'min:0',
            ],
            '*.parent' => [
                'nullable',
                'integer',
                function ($attribute, $value, $fail) {
                    $type = request()->input(str_replace('.parent', '.type', $attribute));
                    if ($type === 'room' && $value !== null) {
                        $fail(__('Room cannot have a parent'));
                    } elseif ($type === 'aisle' && !WarehouseLocationRoom::find($value)) {
                        $fail(__("Aisle's parent room does not exist"));
                    } elseif ($type === 'shelf' && !WarehouseLocationAisle::find($value)) {
                        $fail(__("Shelf's parent aisle does not exist"));
                    }
                },
            ],
        ];
    }
}
