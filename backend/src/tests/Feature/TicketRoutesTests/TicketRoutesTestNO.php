<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

class TicketRoutesTest extends TestCase
{
  
        //---Test to check if routes are registered---

    public function test_ticket_routes_are_registered_index()
    {
        $this->assertTrue(Route::has('tickets.index'));
    }

     public function test_ticket_routes_are_registered_store()
     {
        $this->assertTrue(Route::has('tickets.store'));
     }

    public function test_ticket_routes_are_registered_show()
    {
        $this->assertTrue(Route::has('tickets.show'));
    }

    public function test_ticket_routes_are_registered_update()
    {
        $this->assertTrue(Route::has('tickets.update'));
    }

    public function test_ticket_routes_are_registered_destroy()
    {
        $this->assertTrue(Route::has('tickets.destroy'));
    }

    public function test_ticket_routes_are_registered_status_update() 
    { 
        $this->assertTrue(Route::has('tickets.status.update')); 
    } 
    
    public function test_ticket_routes_are_registered_priority_update() 
    { 
        $this->assertTrue(Route::has('tickets.priority.update')); 
    } 
    
    public function test_ticket_routes_are_registered_assign() 
    { 
        $this->assertTrue(Route::has('tickets.assign')); 
    } 
    
    public function test_ticket_routes_are_registered_comments_index() 
    { 
        $this->assertTrue(Route::has('tickets.comments.index')); 
    } 
    
    public function test_ticket_routes_are_registered_comments_store() 
    { 
        $this->assertTrue(Route::has('tickets.comments.store')); 
    }


    //---Test to guest cannot acces routes---
    public function test_guest_cannot_access_tickets_index()
    {
        $this->getJson('/api/tickets')->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_store()
    {
        $this->postJson('/api/tickets', [])->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_show()
    {
        $this->getJson('/api/tickets/1')->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_update()
    {
        $this->patchJson('/api/tickets/1', [])->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_destroy()
    {
        $this->deleteJson('/api/tickets/1')->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_status_update()
    {
        $this->patchJson('/api/tickets/1/status', [])->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_priority_update()
    {
        $this->patchJson('/api/tickets/1/priority', [])->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_assign()
    {
        $this->patchJson('/api/tickets/1/assign', [])->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_comments_index()
    {
        $this->getJson('/api/tickets/1/comments')->assertStatus(401);
    }

    public function test_guest_cannot_access_tickets_comments_store()
    {
        $this->postJson('/api/tickets/1/comments', [])->assertStatus(401);
    }
    
    
    //---Test to user authentication for the routes---
    private function actingAsUser(): User
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
        return $user;
    }

    public function test_user_can_access_tickets_index()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->getJson('/api/tickets')->getStatusCode());
    }

    public function test_user_can_access_tickets_store()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->postJson('/api/tickets', [])->getStatusCode());
    }

    public function test_user_can_access_tickets_show()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->getJson('/api/tickets/1')->getStatusCode());
    }

    public function test_user_can_access_tickets_update()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->patchJson('/api/tickets/1', [])->getStatusCode());
    }

    public function test_user_can_access_tickets_destroy()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->deleteJson('/api/tickets/1')->getStatusCode());
    }

    public function test_user_can_access_tickets_status_update()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->patchJson('/api/tickets/1/status', [])->getStatusCode());
    }

    public function test_user_can_access_tickets_priority_update()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->patchJson('/api/tickets/1/priority', [])->getStatusCode());
    }

    public function test_user_can_access_tickets_assign()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->patchJson('/api/tickets/1/assign', [])->getStatusCode());
    }

    public function test_user_can_access_tickets_comments_index()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->getJson('/api/tickets/1/comments')->getStatusCode());
    }

    public function test_user_can_access_tickets_comments_store()
    {
        $this->actingAsUser();
        $this->assertNotEquals(401, $this->postJson('/api/tickets/1/comments', [])->getStatusCode());
    }
}
