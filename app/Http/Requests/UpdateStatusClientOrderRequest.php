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
                "min:1",
                "max:6",
                Rule::when($this->clientOrder->status == 1, function () {
                    return "in:2,6";
                }),
                Rule::when($this->clientOrder->status == 2, function () {
                    return "in:6";
                }),
                Rule::when($this->clientOrder->status == 3, function () {
                    return "in:2,6";
                }),
                Rule::when($this->clientOrder->status == 4, function () {
                    return "in:2,6";
                }),
                Rule::when($this->clientOrder->status == 5, function () {
                    return "in:";
                }),
                Rule::when($this->clientOrder->status == 6, function () {
                    return "in:";
                }),
            ],
        ];
    }
}
