<?php
namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{

        return [
            'code_connect_id' => 'required|integer|exists:users,id',
            'forum_answer_id' => 'nullable|integer|exists:forum_answers,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'name' => 'required|string|max:255',
            'incident_date' => 'required|date',
            'affected_app' => 'required|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'required|in:error,suggestion',
            'affected_function' => 'required|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'required|string',
        ];
    }
}