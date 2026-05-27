<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class AssignTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{
        return [
            'assignee_id' => 'required|integer|exists:users,id'
        ];
    }
}

?>
