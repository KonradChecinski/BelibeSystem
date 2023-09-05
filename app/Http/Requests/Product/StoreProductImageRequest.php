<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class StoreProductImageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("createImages", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            "model_color_id" => 'required|numeric|min:1',
            "type" => 'required|numeric|min:1|max:3',
            "files" => 'required|array|max:10',
            "files.*" => [
                'required',
                File::image()
                    ->min('1kb')
                    ->max('30mb')
                    ->types(['image/jpeg', 'image/png'])
            ]

        ];
    }
}
