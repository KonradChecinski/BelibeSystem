<?php

namespace App\Http\Requests;

use App\Models\WarehouseLocation;
use App\Models\WarehouseLocationAisle;
use App\Models\WarehouseLocationRoom;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWarehouseProductModelRequest extends FormRequest
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
        $productModel = $this->productModel; // może być instancją modelu
        $productModelId = $productModel->getKey();

        return [
            // Pokój musi istnieć
            'room_id' => ['bail', 'required', 'integer', 'exists:warehouse_location_rooms,id'],

            // Aleja musi istnieć i należeć do wskazanego pokoju
            'aisle_id' => [
                'bail',
                'required',
                'integer',
                Rule::exists('warehouse_location_aisles', 'id')
                    ->where(fn($q) => $q->where('warehouse_location_room_id', $this->input('room_id'))),
            ],

            // Półka musi istnieć i należeć do wskazanej alei
            // + unikalność na tabeli pivot dla danego product_model_id
            'shelf_id' => [
                'bail',
                'required',
                'integer',
                Rule::exists('warehouse_locations', 'id')
                    ->where(fn($q) => $q->where('warehouse_location_aisle_id', $this->input('aisle_id'))),
                Rule::unique('product_model_warehouse_location', 'warehouse_location_id')
                    ->where(fn($q) => $q->where('product_model_id', $productModelId)),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => 'Wybierz pokój.',
            'room_id.exists' => 'Wybrany pokój nie istnieje.',

            'aisle_id.required' => 'Wybierz aleję.',
            'aisle_id.exists' => 'Wybrana aleja nie istnieje lub nie należy do wybranego pokoju.',

            'shelf_id.required' => 'Wybierz regał.',
            'shelf_id.exists' => 'Wybrany regał nie istnieje lub nie należy do wybranej alei.',
            'shelf_id.unique' => 'Ten model produktu jest już przypisany do wybranej lokalizacji magazynowej.',
        ];
    }


}
