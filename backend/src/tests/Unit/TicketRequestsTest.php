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
            'title' => '',
            'web_application' => '',
            'type' => '',
            'feature' => '',
            'description' => '',
        ], $request->rules());
    }

    /** @test */
    public function update_ticket_request_has_correct_rules(): void{

        $request = new UpdateTicketRequest();
        //Determine the correct rules, here and the Request
        $this->assertEquals([
            'title' => '',
            'web_application' => '',
            'type' => '',
            'feature' => '',
            'description' => '',
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