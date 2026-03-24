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
            'code_connect_id' => $user->id,
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
            'code_connect_id',
            'name',
            'incident_date',
            'affected_app',
            'type',
            'affected_function',
            'description',
        ]);  
        
    }

    /** @test */
    public function a_mentor_can_only_see_their_own_tickets(): void
    {
        $user = User::factory()->create();
        $user->assignRole('mentor');
        $otherUser = User::factory()->create();
        Sanctum::actingAs($user);

        Ticket::factory()->create(['code_connect_id' => $user->id]);
        Ticket::factory()->create(['code_connect_id' => $user->id]);
        Ticket::factory()->create(['code_connect_id' => $otherUser->id]);

        $response = $this->getJson('/api/tickets');

        $response->assertStatus(200);

        $data = $response->json('data');
        $this->assertCount(2, $data);

        foreach ($data as $ticket) {
            $this->assertEquals($user->id, $ticket['code_connect_id']);
        }
    }

    /** @test */
    public function an_admin_can_see_all_tickets(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        $otherUser = User::factory()->create();
        Sanctum::actingAs($admin);

        Ticket::factory()->create(['code_connect_id' => $admin->id]);
        Ticket::factory()->create(['code_connect_id' => $otherUser->id]);

        $response = $this->getJson('/api/tickets');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    /** @test */
    public function a_student_can_only_see_their_own_tickets(): void
    {
        $student = User::factory()->create();
        $student->assignRole('student');
        $otherUser = User::factory()->create();
        Sanctum::actingAs($student);

        Ticket::factory()->create(['code_connect_id' => $student->id]);
        Ticket::factory()->create(['code_connect_id' => $otherUser->id]);

        $response = $this->getJson('/api/tickets');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($student->id, $response->json('data.0.code_connect_id'));
    }

}

?>
