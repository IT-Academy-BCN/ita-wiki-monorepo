<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePriorityRequest extends FormRequest{

    public function authorize(): bool{

        return true;
    }

    public function rules(): array{

        return [
            'priority' => 'required|in:low,medium,high,critical'
        ];
    }
}

?>
