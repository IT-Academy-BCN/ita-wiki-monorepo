<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatusTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{
        return [
            'status' => 'required|in:pending,in_progress,blocked,ready,closed'
        ];
    }
}

?>
