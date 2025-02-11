<?php

namespace App\Http\Requests;

use App\Helpers\Helper;
use Illuminate\Foundation\Http\FormRequest;

class StoreClientOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $client = Helper::getClientToB2b();
        if (Helper::isOrderToEdit()) {
            return $client->blacklist === 0 && Helper::getClientOrderProductToEdit(Helper::getClientOrderIdToEditToB2b())->count() > 0;
        }
        return $client->blacklist === 0 && $client->cart()->count() > 0;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "payment" => ["required", "array"],
            "payment.id" => ["required", "integer", "exists:b2b_payments,id"],
            "delivery" => ["required", "array"],
            "delivery.id" => ["required", "integer", "exists:b2b_deliveries,id"],
            "location" => ["required", "array"],
            "location.id" => ["required", "integer", "exists:client_locations,id"],
            "client_comment" => ["nullable", "string"],
            "user_comment" => ["nullable", "string"],
        ];
    }
}
