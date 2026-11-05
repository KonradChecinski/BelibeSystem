<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class DeleteProductSizeChartRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editDictionaries", "user");
    }

    public function rules(): array
    {
        return [
            'clickedRowId' => 'required|integer|exists:product_size_charts,id',
        ];
    }
}

