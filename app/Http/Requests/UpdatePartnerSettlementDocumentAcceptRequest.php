<?php

namespace App\Http\Requests;

use App\Models\Partner;
use App\Models\PartnerSettlement;
use App\Models\PartnerSettlementDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdatePartnerSettlementDocumentAcceptRequest extends FormRequest
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
            $partnerSettlementDocument = $this->partnerSettlementDocument;
            $partnerSettlement = $this->partnerSettlement;
            $partner = $this->partner;

            if (!$partnerSettlementDocument || !$partnerSettlement || !$partner) {
                return;
            }

            if ($partnerSettlementDocument->status === 2) {
                $validator->errors()->add('partnerSettlementDocument', 'Dokument rozliczenia został już rozliczony.');
            }

            if ($partnerSettlementDocument->partner_settlement_id !== $partnerSettlement->id) {
                $validator->errors()->add('partnerSettlementDocument', 'Dokument rozliczenia nie należy do określonego rozliczenia.');
//                $validator->errors()->add('partnerSettlementDocument', 'The settlement document does not belong to the specified settlement.');
            }

            if ($partnerSettlement->partner_id !== $partner->id) {
                $validator->errors()->add('settlement_id', 'Rozliczenie nie należy do określonego partnera.');
//                $validator->errors()->add('settlement_id', 'The settlement does not belong to the specified partner.');
            }
        });
    }
}
