<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdatePartnerSettlementDocumentAcceptAllRequest extends FormRequest
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
            //
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
            $partnerSettlement = $this->partnerSettlement;
            $partner = $this->partner;

            if (!$partnerSettlement || !$partner) {
                return;
            }

            if ($partnerSettlement->partner_id !== $partner->id) {
                $validator->errors()->add('settlement_id', 'Rozliczenie nie należy do określonego partnera.');
//                $validator->errors()->add('settlement_id', 'The settlement does not belong to the specified partner.');
            }
        });
    }
}
