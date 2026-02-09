<?php
namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{

        return [
            'title' => '',
            'web_application' => '',
            'type' => '',
            'feature' => '',
            'description' => '',
        ];
    }
}

?>