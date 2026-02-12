<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class TicketRoutesTest extends TestCase
{
    public function test_ticket_routes_are_registered()
    {
        $this->assertTrue(Route::has('tickets.index'));
        $this->assertTrue(Route::has('tickets.store'));
        $this->assertTrue(Route::has('tickets.show'));
        $this->assertTrue(Route::has('tickets.update'));
        $this->assertTrue(Route::has('tickets.destroy'));

        $this->assertTrue(Route::has('tickets.status.update'));
        $this->assertTrue(Route::has('tickets.priority.update'));
        $this->assertTrue(Route::has('tickets.assign'));

        $this->assertTrue(Route::has('tickets.comments.index'));
        $this->assertTrue(Route::has('tickets.comments.store'));
    }

    public function test_guest_cannot_access_ticket_routes()
    {
        $this->getJson('/api/tickets')
            ->assertStatus(401);

        $this->postJson('/api/tickets', [])
            ->assertStatus(401);

        $this->patchJson('/api/tickets/1/status', [])
            ->assertStatus(401);

        $this->patchJson('/api/tickets/1/priority', [])
            ->assertStatus(401);

        $this->patchJson('/api/tickets/1/assign', [])
            ->assertStatus(401);

        $this->getJson('/api/tickets/1/comments')
            ->assertStatus(401);

        $this->postJson('/api/tickets/1/comments', [])
            ->assertStatus(401);
    }

    public function test_user_can_access_ticket_routes()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $response = $this->getJson('/api/tickets');

        $this->assertNotEquals(401, $response->getStatusCode());
    }
}
