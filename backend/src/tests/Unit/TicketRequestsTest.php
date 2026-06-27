<?php

namespace Tests\Feature\ReportingTickets;

use App\Models\Ticket;
use App\Models\User;
use App\Http\Requests\Tickets\CreateTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketRequestsTest extends TestCase{

    use RefreshDatabase;

    /** @test */
    public function create_ticket_request_has_correct_rules(): void{

        $request = new CreateTicketRequest();
        //Determine the correct rules, here and the Request
        $this->assertEquals([
            'forum_answer_id' => 'nullable|integer|exists:forum_answers,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'name' => 'nullable|string|max:255',
            'incident_date' => 'nullable|date',
            'affected_app' => 'nullable|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'nullable|in:error,suggestion',
            'affected_function' => 'nullable|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'required|string',
            'priority' => 'nullable|in:low,medium,high,critical',
            'category' => 'required|in:bug,suggestion,other',
        ], $request->rules());
    }

    /** @test */
    public function update_ticket_request_has_correct_rules(): void{

        $request = new UpdateTicketRequest();
        //Determine the correct rules, here and the Request
        $this->assertEquals([
            'code_connect_id' => 'sometimes|required|integer|exists:users,id',
            'assignee_id' => 'sometimes|nullable|integer|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'incident_date' => 'sometimes|required|date',
            'affected_app' => 'sometimes|required|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'sometimes|required|in:error,suggestion',
            'affected_function' => 'sometimes|required|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'sometimes|required|string'
        ], $request->rules());
    }

    /**@test */
    public function create_ticket_request_is_authorized(): void{

        $request = new CreateTicketRequest();
        $this->assertTrue($request->authorize());
    }

    /**@test */
    public function update_ticket_request_is_authorized(): void{

        $request = new UpdateTicketRequest();
        $this->assertTrue($request->authorize());
    }
}

?>
