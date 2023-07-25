<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class DataProductModelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'page' => 'required|numeric|min:1',
            'limit' => 'required|numeric|min:5',
            'orderBy' => 'string',
            'order' => 'string|in:asc,desc',
            'search' => 'json',
            'filter' => 'json'
        ];
    }
}
