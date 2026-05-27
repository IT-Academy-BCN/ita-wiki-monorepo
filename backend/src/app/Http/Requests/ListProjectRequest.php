<?php

declare (strict_types= 1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListProjectRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => [$this->isMethod('post') ? 'required' : 'nullable', 'string'],
            'limit_date_inscription' => 'nullable|date|after_or_equal:today',
            'start_date' => [$this->isMethod('post') ? 'required' : 'nullable', 'date'],
            'end_date' => [$this->isMethod('post') ? 'required' : 'nullable', 'date', 'after:start_date'],
            'dev_front_number' => [$this->isMethod('post') ? 'required' : 'nullable', 'integer', 'min:1'],
            'dev_back_number' => [$this->isMethod('post') ? 'required' : 'nullable', 'integer', 'min:1'],
            'time_duration' => 'required|string|max:255',
            'language_backend' => 'required|string|max:255',
            'language_frontend' => 'required|string|max:255',
            'roadmap' => 'nullable|array',

            'programming_role' => [
                $this->isMethod('post') ? 'required' : 'nullable',
                'string',
                'in:Frontend Developer,Backend Developer,Fullstack Developer,Other',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => "The title field is required.",
            'description.required' => "The description field is required.",
            'limit_date_inscription.date' => "The limit date of inscription must be a valid date.",
            'limit_date_inscription.after_or_equal' => "The limit date of inscription must be today or a future date.",
            'dev_front_number.integer' => "The number of frontend developers must be an integer",
            'dev_front_number.min' => "The number of frontend developers must be at least 1",
            'dev_back_number.integer' => "The number of backend developers must be an integer",
            'dev_back_number.min' => "The number of backend developers must be at least 1",
            'time_duration.required' => "The time duration field is required.",
            'time_duration.string' => "The time duration must be a string.",
            'language_backend.required' => "The backend language field is required.",
            'language_frontend.required' => "The frontend language field is required.",
            'programming_role.required' => 'The programming role field is required.',
            'programming_role.in' => 'The programming role must be one of: Frontend Developer, Backend Developer, Fullstack Developer, Other.',
        ];
    }
}
