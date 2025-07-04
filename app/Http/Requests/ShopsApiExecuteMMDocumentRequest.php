<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ShopsApiExecuteMMDocumentRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'document_id' => [
                'required',
                'integer',
                Rule::exists('subiekt.dok__Dokument', 'dok_id')
                    ->where("dok_typ", 9) //typ 9 to MM (magazynowy)
                    ->where("dok_Status", 4) //tylko zrealizowane na magazynie źródłowym
            ]
        ];
    }
}
