<?php
namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{

        return [
            'forum_answer_id' => 'nullable|integer|exists:forum_answers,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'name' => 'nullable|string|max:255',
            'incident_date' => 'nullable|date',
            'affected_app' => 'nullable|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'nullable|in:error,suggestion',
            'affected_function' => 'nullable|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'required|string',
            'priority' => 'nullable|in:low,medium,high,critical',
        ];
    }
}