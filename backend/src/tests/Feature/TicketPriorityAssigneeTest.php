<?php

declare(strict_types=1);
namespace Tests\Feature\Tickets;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketPriorityAssigneeTest extends TestCase {
    use RefreshDatabase;
    public function test_admin_can_update_priority_on_ticket_they_did_not_create(): void {
        $creator = User::factory()->create();
        $admin   = User::factory()->create();
        $admin->assignRole('admin');
        $ticket = Ticket::factory()->create(['code_connect_id' => $creator->id]);
        $response = $this->actingAs($admin)->patchJson("/api/tickets/{$ticket->id}/priority", [
                'priority' => 'high'
            ]);
        $response->assertStatus(200);
        $response->assertJsonFragment(['success' => true]);
    }

    public function test_admin_can_assign_ticket_they_did_not_create(): void {
        $creator  = User::factory()->create();
        $admin    = User::factory()->create();
        $assignee = User::factory()->create();
        $admin->assignRole('admin');
        $ticket = Ticket::factory()->create(['code_connect_id' => $creator->id]);
        $response = $this->actingAs($admin) ->patchJson("/api/tickets/{$ticket->id}/assignee", ['assignee_id' => $assignee->id]);
        $response->assertStatus(200);
        $response->assertJsonFragment(['success' => true]);
    }

    public function test_non_admin_cannot_update_priority(): void {
        $user   = User::factory()->create();
        $ticket = Ticket::factory()->create();
        $response = $this->actingAs($user)->patchJson("/api/tickets/{$ticket->id}/priority", ['priority' => 'high']);
        $response->assertStatus(403);
    }

    public function test_non_admin_cannot_update_assignee(): void{
        $user     = User::factory()->create();
        $assignee = User::factory()->create(); 
        $ticket   = Ticket::factory()->create();
        $response = $this->actingAs($user)
            ->patchJson("/api/tickets/{$ticket->id}/assignee", [
                'assignee_id' => $assignee->id ]);
        $response->assertStatus(403);
    }
}
