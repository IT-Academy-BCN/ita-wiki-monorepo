<?php

declare(strict_types=1);

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class CompleteProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'github_url' => ['nullable', 'url'],
            'youtube_url' => ['nullable', 'url'],
        ];
    }

    public function messages(): array
    {
        return [
            'github_url.url' => 'The GitHub URL must be a valid URL.',
            'youtube_url.url' => 'The YouTube URL must be a valid URL.',
        ];
    }
}
