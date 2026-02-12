<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketTypeEnum;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;

class TicketSystemTest extends TestCase
{
    /** @test */
    public function ticket_model_can_be_created_with_enums(): void
    {
        $user = User::factory()->create();

        $ticket = Ticket::create([
            'name' => 'Error en login',
            'incident_date' => now(),
            'affected_app' => AffectedAppEnum::WikiFrontend,
            'type' => TicketTypeEnum::Error,
            'affected_function' => AffectedFunctionEnum::Login,
            'description' => 'No puedo iniciar sesión',
            'code_connect_id' => $user->id,
            'status' => TicketStatusEnum::Pending
        ]);

        $this->assertInstanceOf(Ticket::class, $ticket);
        $this->assertEquals(TicketStatusEnum::Pending, $ticket->status);
        $this->assertEquals(TicketTypeEnum::Error, $ticket->type);
    }

    /** @test */
    public function ticket_belongs_to_creator(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $this->assertInstanceOf(User::class, $ticket->codeConnect);
        $this->assertEquals($user->id, $ticket->codeConnect->id);
    }

    /** @test */ 
    public function ticket_has_many_comments(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $comment = $ticket->comments()->create([
            'user_id' => $user->id,
            'comment' => 'Este es un comentario de prueba',
            'is_closing_comment' => false
        ]);

        $this->assertCount(1, $ticket->comments);
        $this->assertInstanceOf(TicketComment::class, $comment);
    }

    /** @test */
    public function ticket_comment_belongs_to_ticket_and_user(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);        
        $comment = TicketComment::factory()->create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id
        ]);

        $this->assertInstanceOf(Ticket::class, $comment->ticket);
        $this->assertInstanceOf(User::class, $comment->user);
        $this->assertEquals($ticket->id, $comment->ticket->id);
        $this->assertEquals($user->id, $comment->user->id);
    }

    /** @test */
    public function user_has_tickets_relation(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $this->assertCount(1, $user->tickets);
        $this->assertInstanceOf(Ticket::class, $user->tickets->first());
    }

    /** @test */
    public function ticket_casts_work_correctly(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create([
            'code_connect_id' => $user->id,
            'incident_date' => '2026-02-08'
        ]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $ticket->incident_date);
        $this->assertTrue($ticket->status instanceof TicketStatusEnum);
        $this->assertTrue($ticket->type instanceof TicketTypeEnum);
    }

    /** @test */
    public function ticket_comment_casts_work_correctly(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);
        $comment = TicketComment::factory()->create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'is_closing_comment' => true
        ]);

        $this->assertIsBool($comment->is_closing_comment);
        $this->assertTrue($comment->is_closing_comment);
    }

    /** @test */
    public function ticket_can_be_closed(): void
    {
        $user = User::factory()->create();
        $closerUser = User::factory()->create();
        $ticket = Ticket::factory()->create(['code_connect_id' => $user->id]);

        $ticket->update([
            'closed_by' => $closerUser->id,
            'closed_at' => now(),
            'status' => TicketStatusEnum::Closed
        ]);

        $this->assertEquals($closerUser->id, $ticket->closed_by);
        $this->assertNotNull($ticket->closed_at);
        $this->assertEquals(TicketStatusEnum::Closed, $ticket->status);
    }

    /** @test */
    public function ticket_belongs_to_closed_by_user(): void
    {
        $user = User::factory()->create();
        $closerUser = User::factory()->create();
        $ticket = Ticket::factory()->create([
            'code_connect_id' => $user->id,
            'closed_by' => $closerUser->id,
            'closed_at' => now()
        ]);

        $this->assertInstanceOf(User::class, $ticket->closedBy);
        $this->assertEquals($closerUser->id, $ticket->closedBy->id);
    }

    /** @test */
    public function user_has_closed_tickets_relation(): void
    {
        $user = User::factory()->create();
        $closerUser = User::factory()->create();
        $ticket = Ticket::factory()->create([
            'code_connect_id' => $user->id,
            'closed_by' => $closerUser->id
        ]);

        $this->assertCount(1, $closerUser->closedTickets);
        $this->assertInstanceOf(Ticket::class, $closerUser->closedTickets->first());
    }
}