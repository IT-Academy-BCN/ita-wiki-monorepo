<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{
        return [
            'code_connect_id' => 'nullable|integer|exists:code_connects,id',
            'name' => 'required|string|max:255',
            'incident_date' => 'required|date',
            'affected_app' => 'nullable|string|max:255',
            'type' => 'required|in:bug,feature,task',
            'affected_function' => 'nullable|string|max:255',
            'description' => 'nullable|string',

        ];
    }
}
?>
