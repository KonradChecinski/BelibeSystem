<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateB2bDeliveryRequest extends FormRequest
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
            'name' => 'string|required|min:3',
            'description' => 'string|required|min:3',
            'subiekt_id' => 'numeric|required',
            'price_net' => 'numeric|required|min:0|lt:price_gross',
            'price_gross' => 'numeric|required|min:0|gt:price_net',
            'free_from' => 'numeric|required|min:0',
            'active' => 'boolean|required',
            'delivery_time_min' => 'numeric|required|min:1|lte:delivery_time_max',
            'delivery_time_max' => 'numeric|required|min:2|gte:delivery_time_min',
        ];
    }
}
