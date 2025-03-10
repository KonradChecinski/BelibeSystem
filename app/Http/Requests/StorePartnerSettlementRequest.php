<?php

namespace App\Http\Requests;

use App\Models\PartnerSettlement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StorePartnerSettlementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editPartners", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "date" => ["required", "date"],
            "file" => ["required", "file", "max:10240"]
        ];
    }


    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function (Validator $validator) {
            if ($this->partner->partnerSettlements()->whereHas('documents', function ($query) {
                $query->where('status', 0);
            })->exists()) {
                $validator->errors()->add("exist", 'Stworzone jest rozliczenie, które nie jest zakończone. Zakończ je przed dodaniem nowego.');
            }
        });
    }
}
