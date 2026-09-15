<?php

namespace App\Http\Requests;

use App\Models\ClientOrder;
use App\Models\Courier;
use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->hasPermissionTo('createShipments', 'user');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id' => ['required', 'integer'],
            'order_type' => ['nullable', 'string', 'in:' . ClientOrder::class . ',' . \App\Models\Order::class],
            'courier_id' => ['required', 'integer', 'exists:couriers,id'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_company' => ['nullable', 'string', 'max:255'],
            'recipient_street' => ['required', 'string', 'max:255'],
            'recipient_building_number' => ['required', 'string', 'max:50'],
            'recipient_apartment_number' => ['nullable', 'string', 'max:50'],
            'recipient_postal_code' => ['required', 'string', 'max:20'],
            'recipient_city' => ['required', 'string', 'max:255'],
            'recipient_country' => ['required', 'string', 'size:2'],
            'recipient_point' => ['nullable'],
            'recipient_phone' => ['required', 'string', 'max:50'],
            'recipient_email' => ['required', 'email', 'max:255'],
            'cod' => ['nullable', 'boolean'],
            'cod_value' => ['nullable', 'numeric', 'min:0'],
            'package_count' => ['required', 'integer', 'min:1'],
            'shipment_packages' => ['required', 'array', 'min:1'],
            'shipment_packages.*.weight' => ['nullable', 'numeric', 'min:0'],
            'shipment_packages.*.width' => ['nullable', 'numeric', 'min:0'],
            'shipment_packages.*.height' => ['nullable', 'numeric', 'min:0'],
            'shipment_packages.*.depth' => ['nullable', 'numeric', 'min:0'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $courier = Courier::query()->find($this->input('courier_id'));
            if (!$courier) {
                return;
            }

            $packages = $this->input('shipment_packages', []);
            if (!$courier->allows_multiple_packages && count($packages) > 1) {
                $validator->errors()->add('shipment_packages', 'Ten kurier nie obsługuje wielu paczek.');
            }

            foreach ($packages as $index => $package) {
                foreach (['weight', 'width', 'height', 'depth'] as $field) {
                    $enabledKey = $field . '_enabled';
                    $requiredKey = $field . '_required';

                    if (!($courier->$enabledKey ?? false) || !($courier->$requiredKey ?? false)) {
                        continue;
                    }

                    $value = $package[$field] ?? null;
                    $hasValue = $value !== null && $value !== '' && trim((string)$value) !== '';

                    if (!$hasValue) {
                        $validator->errors()->add("shipment_packages.$index.$field", 'Pole jest wymagane.');
                    }
                }
            }
        });
    }
}
