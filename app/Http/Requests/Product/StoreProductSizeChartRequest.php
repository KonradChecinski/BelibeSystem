<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductSizeChartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editDictionaries", "user");
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'table_data' => 'required|array',
            'table_data.headers' => 'required|array|min:1',
            'table_data.rows' => 'required|array|min:1',
            'tiktok_template_id' => 'nullable|string|max:255',
        ];
    }
}

