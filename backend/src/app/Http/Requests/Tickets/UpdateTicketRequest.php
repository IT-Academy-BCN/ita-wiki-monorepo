<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{
        return [
            'code_connect_id' => 'sometimes|required|integer|exists:users,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'incident_date' => 'sometimes|required|date',
            'affected_app' => 'sometimes|required|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'sometimes|required|in:error,suggestion',
            'affected_function' => 'sometimes|required|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'sometimes|required|string',
            'priority' => 'nullable|in:low,medium,high,critical',
            'status' => 'nullable|in:pending,in_progress,blocked,ready,closed',
        ];
    }
}
?>
