<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShowProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editProducts", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'show_in_subiekt' => 'required_without_all:show_in_b2b,show_in_b2c,show_in_allegro|boolean',
            'show_in_b2b' => 'required_without_all:show_in_subiekt,show_in_b2c,show_in_allegro|boolean',
            'show_in_b2c' => 'required_without_all:show_in_subiekt,show_in_b2b,show_in_allegro|boolean',
            'show_in_allegro' => 'required_without_all:show_in_subiekt,show_in_b2b,show_in_b2c|boolean',
        ];
    }
}
