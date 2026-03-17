<?php

namespace Tests\Feature\ReportingTickets;
use App\Models\Ticket;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketControllerTest extends TestCase{

    use RefreshDatabase;

    /** @test */
    public function an_auth_user_can_create_a_ticket(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->actingAs($user)->postJson('/api/tickets', [
            'name' => 'Test Ticket',
            'incident_date' => now()->toDateString(),
            'affected_app' => 'wiki_frontend',
            'type' => 'error',
            'affected_function' => 'login',
            'description' => 'This is a test ticket.'
        ]);
        

        $response->assertStatus(201)->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'affected_app',
                'type',
                'affected_function',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);      

        $this->assertDatabaseHas('tickets', [
            'code_connect_id' => $user->id,
            'name' => 'Test Ticket',
            'affected_app' => 'wiki_frontend',
            'type' => 'error',
            'affected_function' => 'login',
            'description' => 'This is a test ticket.'
        ]);
        
    }

    /** @test */
    public function an_not_auth_user_cannot_create_a_ticket(): void{
        $response = $this->postJson('/api/tickets', [
            'code_connect_id' => 1,
            'name' => 'Test Ticket',
            'incident_date' => now()->toDateString(),
            'affected_app' => 'wiki_frontend',
            'type' => 'error',
            'affected_function' => 'login',
            'description' => 'This is a test ticket.'
        ]);       

        $response->assertStatus(401);
    }

    /** @test */
    public function an_auth_user_can_view_a_ticket(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create();


        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'affected_app',
                'type',
                'affected_function',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
        
    }

    /** @test */
    public function an_not_auth_user_cannot_view_a_ticket(): void{

        $ticket = Ticket::factory()->create();

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(401);
    }

    /** @test */
    public function an_auth_user_can_update_a_ticket(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create([

            'name' => 'Old Name',
            'affected_app' => 'wiki_frontend',
            'type' => 'error',
            'affected_function' => 'login',
            'description' => 'Old description.',
        ]);
        


        $response = $this->actingAs($user)->putJson("/api/tickets/{$ticket->id}", [
            'name' => 'Updated Name',
            'affected_app' => 'wiki_backend',
            'type' => 'suggestion',
            'affected_function' => 'profile',
            'description' => 'Updated description.',
        ]);
        
        $response->assertStatus(200)->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'affected_app',
                'type',
                'affected_function',
                'description',
                'created_at',
                'updated_at'
            ]
        ]);
        

        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'name' => 'Updated Name',
            'affected_app' => 'wiki_backend',
            'type' => 'suggestion',
            'affected_function' => 'profile',
            'description' => 'Updated description.',
        ]);
        
    }

    /** @test*/
    public function an_not_auth_user_cannot_update_a_ticket(): void{

        $ticket = Ticket::factory()->create();

        $response = $this->putJson("/api/tickets/{$ticket->id}", [
            'name' => 'Updated Name',
            'affected_app' => 'wiki_backend',
            'type' => 'suggestion',
            'affected_function' => 'profile',
            'description' => 'Updated description.',
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function an_auth_user_can_delete_a_ticket(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $ticket = Ticket::factory()->create();

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('tickets', [
            'id' => $ticket->id,
        ]);
    }

    /** @test */
    public function an_not_auth_user_cannot_delete_a_ticket(): void{

        $ticket = Ticket::factory()->create();

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(401);
    }

    /** @test  */
    public function a_ticket_required_fields(): void{

        $user = User::factory()->create();
        Sanctum::actingAs($user);


        $response = $this->actingAs($user)->postJson('/api/tickets', []);

        $response->assertStatus(422)->assertJsonValidationErrors([
            'name',
            'incident_date',
            'affected_app',
            'type',
            'affected_function',
            'description',
        ]);  
        
    }

    /** @test */
    public function ticket_is_auto_assigned_to_authenticated_user(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tickets', [
            'name' => 'Test Ticket',
            'incident_date' => now()->toDateString(),
            'affected_app' => 'wiki_frontend',
            'type' => 'error',
            'affected_function' => 'login',
            'description' => 'This is a test ticket.',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('tickets', [
            'code_connect_id' => $user->id,
            'name' => 'Test Ticket',
        ]);
    }

}

?>
