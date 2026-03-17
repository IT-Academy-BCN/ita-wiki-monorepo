<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Ticket;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketPriorityEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class TicketBusinessLogicTest extends TestCase{

    use RefreshDatabase;

    /** @test */
    public function ticket_cannot_have_multiple_assignees_simultaneously(): void{

        $user = User::factory()->create();
        $assignee1 = User::factory()->create();
        $assignee2 = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create([
            'code_connect_id' => $user->id,
            'assignee_id' => $assignee1->id,
        ]);

        $this->assertEquals($assignee1->id, $ticket->assignee_id);

        $response = $this->patchJson("/api/tickets/{$ticket->id}/assignee", [
            'assignee_id' => $assignee2->id,
        ]);
        $response->assertStatus(200);

        $ticket->refresh();
        $this->assertEquals($assignee2->id, $ticket->assignee_id);
        $this->assertNotEquals($assignee1->id, $ticket->assignee_id);
    }

    /** @test */
    public function ticket_assignee_field_stores_single_value(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $this->assertIsInt($ticket->assignee_id ?? 0);
        $this->assertIsNotArray($ticket->assignee_id);
    }

    /** @test */
    public function ticket_can_only_have_one_status_at_a_time(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create([
            'code_connect_id' => $user->id,
            'status' => TicketStatusEnum::Pending,
        ]);

        $this->patchJson("/api/tickets/{$ticket->id}/status", ['status' => 'in_progress']);
        $ticket->refresh();
        $this->assertEquals('in_progress', $ticket->status->value);

        $this->patchJson("/api/tickets/{$ticket->id}/status", ['status' => 'closed']);
        $ticket->refresh();
        $this->assertEquals('closed', $ticket->status->value);
        $this->assertNotEquals('in_progress', $ticket->status->value);
    }

    /** @test */
    public function ticket_status_is_single_enum_not_array(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $this->assertInstanceOf(TicketStatusEnum::class, $ticket->status);
        $this->assertIsNotArray($ticket->status);
    }

    /** @test */
    public function ticket_update_fails_when_not_found(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->patchJson('/api/tickets/99999', ['name' => 'Updated']);
        $response->assertStatus(404);
    }

    /** @test */
    public function ticket_creation_fails_with_missing_fields(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tickets', ['name' => 'Test']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'incident_date',
                'affected_app',
                'type',
                'affected_function',
                'description',
            ]);
    }

    /** @test */
    public function ticket_returns_error_for_invalid_enums(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tickets', [
            'code_connect_id' => $user->id,
            'name' => 'Test',
            'incident_date' => '2026-02-15',
            'affected_app' => 'invalid_app',
            'type' => 'invalid_type',
            'affected_function' => 'invalid_function',
            'description' => 'Test',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['affected_app', 'type', 'affected_function']);
    }

    /** @test */
    public function ticket_preserves_creator_through_updates(): void{

        $creator = User::factory()->create();
        $assignee = User::factory()->create();
        Sanctum::actingAs($creator);

        $ticket = Ticket::factory()->create([
            'code_connect_id' => $creator->id,
            'name' => 'Original',
        ]);

        $this->patchJson("/api/tickets/{$ticket->id}", ['name' => 'Updated']);
        $this->patchJson("/api/tickets/{$ticket->id}/assignee", ['assignee_id' => $assignee->id]);

        $ticket->refresh();
        $this->assertEquals($creator->id, $ticket->code_connect_id);
    }

    /** @test */
    public function closing_ticket_sets_closed_by_automatically(): void{

        $creator = User::factory()->create();
        $closer = User::factory()->create();
        Sanctum::actingAs($closer);

        $ticket = Ticket::factory()->create([
            'code_connect_id' => $creator->id,
            'closed_by' => null,
            'closed_at' => null,
        ]);

        $this->patchJson("/api/tickets/{$ticket->id}/status", ['status' => 'closed']);

        $ticket->refresh();
        $this->assertEquals($closer->id, $ticket->closed_by);
        $this->assertNotNull($ticket->closed_at);
    }

    /** @test */
    public function non_closed_status_does_not_set_closed_fields(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $this->patchJson("/api/tickets/{$ticket->id}/status", ['status' => 'in_progress']);

        $ticket->refresh();
        $this->assertNull($ticket->closed_by);
        $this->assertNull($ticket->closed_at);
    }

    /** @test */
    public function ticket_belongs_to_creator(): void{

        $creator = User::factory()->create();
        Sanctum::actingAs($creator);

        $ticket = Ticket::factory()->create(['code_connect_id' => $creator->id]);

        $this->assertInstanceOf(User::class, $ticket->codeConnect);
        $this->assertEquals($creator->id, $ticket->codeConnect->id);
    }

    /** @test */
    public function ticket_belongs_to_assignee(): void{

        $creator = User::factory()->create();
        $assignee = User::factory()->create();
        Sanctum::actingAs($creator);

        $ticket = Ticket::factory()->create([
            'code_connect_id' => $creator->id,
            'assignee_id' => $assignee->id,
        ]);

        $this->assertInstanceOf(User::class, $ticket->assignee);
        $this->assertEquals($assignee->id, $ticket->assignee->id);
    }
    /** @test */
    public function ticket_accepts_all_valid_priority_values(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);
        $validPriorities = ['low', 'medium', 'high', 'critical'];

        foreach ($validPriorities as $priority) {
            $response = $this->patchJson("/api/tickets/{$ticket->id}/priority", ['priority' => $priority]);
            $response->assertStatus(200);
        }
    }

    /** @test */
    public function multiple_tickets_can_have_same_name(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticketData = [
            'name' => 'Duplicate Name',
            'incident_date' => '2026-02-15',
            'affected_app' => 'wiki_frontend',
            'type' => 'error',
            'affected_function' => 'login',
            'description' => 'Test',
        ];

        $response1 = $this->postJson('/api/tickets', $ticketData);
        $response2 = $this->postJson('/api/tickets', $ticketData);

        $response1->assertStatus(201);
        $response2->assertStatus(201);
        $this->assertNotEquals($response1->json('data.id'), $response2->json('data.id'));
    }
}
