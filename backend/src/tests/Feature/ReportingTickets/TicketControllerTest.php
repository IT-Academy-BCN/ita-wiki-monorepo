<?php

namespace Tests\Feature\ReportingTickets;
use App\Models\Ticket;
use App\Models\User;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketControllerTest extends TestCase{

    use RefreshDatabase;

    /** @test */
    public function an_auth_user_can_create_a_ticket(): void{

        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/tickets', [
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);

        $response->assertStatus(201)->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'web_application',
                'type',
                'feature',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);

        $this->assertDatabaseHas('tickets', [
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);
    }

    /** @test */
    public function an_not_auth_user_cannot_create_a_ticket(): void{
        $response = $this->postJson('/api/tickets', [
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function an_auth_user_can_view_a_ticket(): void{

        $user = User::factory()->create();

        $ticket = Ticket::factory()->create([
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);

        $response = $this->actingAs($user)->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'web_application',
                'type',
                'feature',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
    }

    /** @test */
    public function an_not_auth_user_cannot_view_a_ticket(): void{

        $ticket = Ticket::factory()->create([
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(401);
    }

    /** @test */
    public function an_auth_user_can_update_a_ticket(): void{

        $user = User::factory()->create();

        $ticket = Ticket::factory()->create([
            'title' => 'Old Title',
            'web_application' => 'Old App',
            'type' => 'Old Type',
            'feature' => 'Old Feature',
            'description' => 'Old description.',
        ]);

        $response = $this->actingAs($user)->putJson("/api/tickets/{$ticket->id}", [
            'title' => 'Updated Title',
            'web_application' => 'Updated App',
            'type' => 'Updated Type',
            'feature' => 'Updated Feature',
            'description' => 'Updated description.',
        ]);

        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'web_application',
                'type',
                'feature',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'title' => 'Updated Title',
            'web_application' => 'Updated App',
            'type' => 'Updated Type',
            'feature' => 'Updated Feature',
            'description' => 'Updated description.',
        ]);
    }

    /** @test*/
    public function an_not_auth_user_cannot_update_a_ticket(): void{

        $ticket = Ticket::factory()->create([
            'title' => 'Old Title',
            'web_application' => 'Old App',
            'type' => 'Old Type',
            'feature' => 'Old Feature',
            'description' => 'Old description.',
        ]);

        $response = $this->putJson("/api/tickets/{$ticket->id}", [
            'title' => 'Updated Title',
            'web_application' => 'Updated App',
            'type' => 'Updated Type',
            'feature' => 'Updated Feature',
            'description' => 'Updated description.',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function an_auth_user_can_delete_a_ticket(): void{

        $user = User::factory()->create();

        $ticket = Ticket::factory()->create([
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('tickets', [
            'id' => $ticket->id,
        ]);
    }

    /** @test */
    public function an_not_auth_user_cannot_delete_a_ticket(): void{

        $ticket = Ticket::factory()->create([
            'title' => 'Test Ticket',
            'web_application' => 'Test App',
            'type' => 'Bug',
            'feature' => 'Test Feature',
            'description' => 'This is a test ticket.'
        ]);

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(401);
    }

    /** @test  */
    public function a_ticket_required_fields(): void{

        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/tickets', [
            'title' => '',
            'web_application' => '',
            'type' => '',
            'feature' => '',
            'description' => '',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors([
            'title',
            'web_application',
            'type',
            'feature',
            'description',
        ]);
    }

    /** @test */
    public function two_tickets_cannot_have_same_id(): void{

        $user = User::factory()->create();

        $ticket1 = Ticket::factory()->create([
            'id' => 1,
            'title' => 'Test Ticket 1',
            'web_application' => 'Test App 1',
            'type' => 'Bug',
            'feature' => 'Test Feature 1',
            'description' => 'This is the first test ticket.'
        ]);

        $ticket2 = Ticket::factory()->create([
            'id' => 1,
            'title' => 'Test Ticket 2',
            'web_application' => 'Test App 2',
            'type' => 'Feature Request',
            'feature' => 'Test Feature 2',
            'description' => 'This is the second test ticket.'
        ]);

        $response = $this->actingAs($user)->postJson('/api/tickets', [
            'id' => 1,
            'title' => 'Test Ticket 2',
            'web_application' => 'Test App 2',
            'type' => 'Feature Request',
            'feature' => 'Test Feature 2',
            'description' => 'This is the second test ticket.'
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['id']);

    }
}

?>