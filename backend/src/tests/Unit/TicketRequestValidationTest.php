<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Requests\Tickets\CreateTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use App\Http\Requests\Tickets\UpdateStatusTicketRequest;
use App\Http\Requests\Tickets\UpdatePriorityRequest;
use App\Http\Requests\Tickets\AssignTicketRequest;
use Illuminate\Support\Facades\Validator;

class TicketRequestValidationTest extends TestCase{

    /** @test */
    public function create_ticket_request_is_authorized(): void{

        $request = new CreateTicketRequest();
        $this->assertTrue($request->authorize());
    }

    /** @test */
    public function create_ticket_request_has_correct_rules(): void{

        $request = new CreateTicketRequest();

        $expectedRules = [
            'forum_answer_id' => 'nullable|integer|exists:forum_answers,id',
            'assignee_id' => 'nullable|integer|exists:users,id',
            'name' => 'nullable|string|max:255',
            'incident_date' => 'nullable|date',
            'affected_app' => 'nullable|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'nullable|in:error,suggestion',
            'affected_function' => 'nullable|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'required|string',
            'status' => 'nullable|in:pending,in_progress,blocked,ready,closed',
            'priority' => 'nullable|in:low,medium,high,critical',
        ];

        $this->assertEquals($expectedRules, $request->rules());
    }

    /** @test */
    public function create_ticket_request_validates_required_fields(): void{

        $request = new CreateTicketRequest();
        $validator = Validator::make([], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertFalse($validator->errors()->has('name'));
        $this->assertFalse($validator->errors()->has('incident_date'));
        $this->assertFalse($validator->errors()->has('affected_app'));
        $this->assertFalse($validator->errors()->has('type'));
        $this->assertFalse($validator->errors()->has('affected_function'));
        $this->assertTrue($validator->errors()->has('description'));
    }

    /** @test */
    public function create_ticket_request_validates_affected_app_enum(): void{

        $request = new CreateTicketRequest();

        $validValues = ['wiki_frontend', 'wiki_backend', 'code_connect', 'other'];
        foreach ($validValues as $value) {
            $validator = Validator::make(['affected_app' => $value], $request->rules());
            $this->assertFalse($validator->errors()->has('affected_app'));
        }

        $validator = Validator::make(['affected_app' => 'invalid'], $request->rules());
        $this->assertTrue($validator->errors()->has('affected_app'));
    }

    /** @test */
    public function create_ticket_request_validates_type_enum(): void{

        $request = new CreateTicketRequest();

        $validValues = ['error', 'suggestion'];
        foreach ($validValues as $value) {
            $validator = Validator::make(['type' => $value], $request->rules());
            $this->assertFalse($validator->errors()->has('type'));
        }

        $validator = Validator::make(['type' => 'invalid'], $request->rules());
        $this->assertTrue($validator->errors()->has('type'));
    }

    /** @test */
    public function create_ticket_request_validates_name_max_length(): void{

        $request = new CreateTicketRequest();

        $validator = Validator::make(['name' => str_repeat('a', 255)], $request->rules());
        $this->assertFalse($validator->errors()->has('name'));

        $validator = Validator::make(['name' => str_repeat('a', 256)], $request->rules());
        $this->assertTrue($validator->errors()->has('name'));
    }

    /** @test */
    public function update_ticket_request_is_authorized(): void{

        $request = new UpdateTicketRequest();
        $this->assertTrue($request->authorize());
    }

    /** @test */
    public function update_ticket_request_has_correct_rules(): void{

        $request = new UpdateTicketRequest();

        $expectedRules = [
            'code_connect_id' => 'sometimes|required|integer|exists:users,id',
            'assignee_id' => 'sometimes|nullable|integer|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'incident_date' => 'sometimes|required|date',
            'affected_app' => 'sometimes|required|in:wiki_frontend,wiki_backend,code_connect,other',
            'type' => 'sometimes|required|in:error,suggestion',
            'affected_function' => 'sometimes|required|in:login,challenges,resources,profile,technical_tests,code_connect,other',
            'description' => 'sometimes|required|string',
        ];

        $this->assertEquals($expectedRules, $request->rules());
    }

    /** @test */
    public function update_ticket_request_allows_partial_updates(): void{

        $request = new UpdateTicketRequest();

        $validator = Validator::make([], $request->rules());
        $this->assertFalse($validator->fails());

        $validator = Validator::make(['name' => 'Updated name'], $request->rules());
        $this->assertFalse($validator->fails());
    }

    /** @test */
    public function update_ticket_request_validates_fields_when_present(): void{

        $request = new UpdateTicketRequest();

        $validator = Validator::make(['type' => 'invalid_type'], $request->rules());
        $this->assertTrue($validator->errors()->has('type'));

        $validator = Validator::make(['type' => 'error'], $request->rules());
        $this->assertFalse($validator->errors()->has('type'));
    }

    /** @test */
    public function update_status_request_is_authorized(): void{

        $request = new UpdateStatusTicketRequest();
        $this->assertTrue($request->authorize());
    }

    /** @test */
    public function update_status_request_has_correct_rules(): void{

        $request = new UpdateStatusTicketRequest();

        $expectedRules = [
            'status' => 'required|in:pending,in_progress,blocked,ready,closed'
        ];

        $this->assertEquals($expectedRules, $request->rules());
    }

    /** @test */
    public function update_status_request_validates_all_valid_statuses(): void{

        $request = new UpdateStatusTicketRequest();
        $validStatuses = ['pending', 'in_progress', 'blocked', 'ready', 'closed'];

        foreach ($validStatuses as $status) {
            $validator = Validator::make(['status' => $status], $request->rules());
            $this->assertFalse($validator->errors()->has('status'));
        }
    }

    /** @test */
    public function update_status_request_rejects_invalid_status(): void{

        $request = new UpdateStatusTicketRequest();
        $invalidStatuses = ['invalid', 'completed', 'open'];

        foreach ($invalidStatuses as $status) {
            $validator = Validator::make(['status' => $status], $request->rules());
            $this->assertTrue($validator->errors()->has('status'));
        }
    }

    /** @test */
    public function update_status_request_ensures_single_status(): void{

        $request = new UpdateStatusTicketRequest();
        $validator = Validator::make(['status' => 'pending'], $request->rules());

        $data = $validator->validated();
        $this->assertCount(1, $data);
        $this->assertEquals('pending', $data['status']);
    }

    /** @test */
    public function update_priority_request_is_authorized(): void{

        $request = new UpdatePriorityRequest();
        $this->assertTrue($request->authorize());
    }

    /** @test */
    public function update_priority_request_has_correct_rules(): void{

        $request = new UpdatePriorityRequest();

        $expectedRules = [
            'priority' => 'required|in:low,medium,high,critical'
        ];

        $this->assertEquals($expectedRules, $request->rules());
    }

    /** @test */
    public function update_priority_request_validates_all_valid_priorities(): void{

        $request = new UpdatePriorityRequest();
        $validPriorities = ['low', 'medium', 'high', 'critical'];

        foreach ($validPriorities as $priority) {
            $validator = Validator::make(['priority' => $priority], $request->rules());
            $this->assertFalse($validator->errors()->has('priority'));
        }
    }

    /** @test */
    public function update_priority_request_rejects_invalid_priority(): void{

        $request = new UpdatePriorityRequest();

        $validator = Validator::make(['priority' => 'invalid'], $request->rules());
        $this->assertTrue($validator->errors()->has('priority'));
    }

    /** @test */
    public function assign_ticket_request_is_authorized(): void{

        $request = new AssignTicketRequest();
        $this->assertTrue($request->authorize());
    }

    /** @test */
    public function assign_ticket_request_has_correct_rules(): void{

        $request = new AssignTicketRequest();

        $expectedRules = [
            'assignee_id' => 'required|integer|exists:users,id'
        ];

        $this->assertEquals($expectedRules, $request->rules());
    }
}
