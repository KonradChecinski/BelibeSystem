<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusClientOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo("editClientOrder", "user");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "status" => [
                "required",
                "integer",
                Rule::in([
                    0,
                    1,
                    20,
                    50,
                    55,
                    60,
                    90,
                    100,
                ]),
                Rule::when($this->clientOrder->status == 1, function () {
                    return "in:20,0";
                }),
                Rule::when($this->clientOrder->status == 20, function () {
                    return "in:0";
                }),
                Rule::when($this->clientOrder->status == 50, function () {
                    return "in:0";
                }),
                Rule::when($this->clientOrder->status == 55, function () {
                    return "in:0";
                }),
                Rule::when($this->clientOrder->status == 60, function () {
                    return "in:0";
                }),
                Rule::when($this->clientOrder->status == 90, function () {
                    return "in:0,60";
                }),
                Rule::when($this->clientOrder->status == 100, function () {
                    return "in:";
                }),
                Rule::when($this->clientOrder->status == 0, function () {
                    return "in:";
                }),
            ],
        ];
    }
}
