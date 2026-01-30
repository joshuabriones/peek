<?php

namespace App\Http\Requests\Message;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'content' => 'required|string|max:500',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'tag' => 'nullable|string|max:50',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'content.required' => 'Message content is required',
            'content.max' => 'Message cannot exceed 500 characters',
            'latitude.required' => 'Location latitude is required',
            'latitude.between' => 'Invalid latitude value',
            'longitude.required' => 'Location longitude is required',
            'longitude.between' => 'Invalid longitude value',
            'tag.max' => 'Tag cannot exceed 50 characters',
        ];
    }
}
